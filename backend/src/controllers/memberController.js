// backend/src/controllers/memberController.js
const Member = require('../models/memberModel');
const { validationResult } = require('express-validator');

// Helper function for error responses
const handleError = (res, error, statusCode = 500) => {
  console.error('Controller Error:', error);
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error',
    errors: error.errors || null
  });
};

// GET all members with pagination, filtering, and search
const getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const packageType = req.query.packageType || '';

    // Build query object
    const query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.membershipStatus = status;
    if (packageType) query.packageType = packageType;

    // Execute query with pagination
    const members = await Member.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      data: members,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    handleError(res, err);
  }
};

// GET member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('-__v')
      .populate('createdBy', 'name email');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, { message: "Invalid member ID" }, 400);
    }
    handleError(res, err);
  }
};

// ADD a new member
const addMember = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if member already exists
    const existingMember = await Member.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'Member with this email or phone already exists'
      });
    }

    // Calculate expiry date based on package type
    const packageDurations = {
      trial: 7,
      basic: 30,
      premium: 90,
      elite: 365
    };

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (packageDurations[req.body.packageType] || 30));

    // Create new member
    const newMember = await Member.create({
      ...req.body,
      expiryDate,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: newMember
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return handleError(res, {
        message: 'Validation failed',
        errors: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      }, 400);
    }
    handleError(res, err);
  }
};

// UPDATE a member
const updateMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if email/phone is being changed and conflicts with another member
    if (req.body.email || req.body.phone) {
      const conflictQuery = {
        _id: { $ne: req.params.id },
        $or: []
      };
      
      if (req.body.email) conflictQuery.$or.push({ email: req.body.email });
      if (req.body.phone) conflictQuery.$or.push({ phone: req.body.phone });
      
      const conflict = await Member.findOne(conflictQuery);
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Email or phone already in use by another member'
        });
      }
    }

    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: updated
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, { message: "Invalid member ID" }, 400);
    }
    if (err.name === 'ValidationError') {
      return handleError(res, {
        message: 'Validation failed',
        errors: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      }, 400);
    }
    handleError(res, err);
  }
};

// DELETE a member
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully',
      data: { id: req.params.id }
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, { message: "Invalid member ID" }, 400);
    }
    handleError(res, err);
  }
};

// GET member statistics
const getMemberStats = async (req, res) => {
  try {
    const stats = await Member.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$membershipStatus', count: { $sum: 1 } } }
          ],
          byPackage: [
            { $group: { _id: '$packageType', count: { $sum: 1 } } }
          ],
          expiringSoon: [
            {
              $match: {
                expiryDate: {
                  $gte: new Date(),
                  $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0].total[0]?.count || 0,
        byStatus: stats[0].byStatus,
        byPackage: stats[0].byPackage,
        expiringSoon: stats[0].expiringSoon[0]?.count || 0
      }
    });
  } catch (err) {
    handleError(res, err);
  }
};

// RENEW membership
const renewMembership = async (req, res) => {
  try {
    const { packageType, paymentAmount, paymentMethod, transactionId } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Calculate new expiry date
    const packageDurations = {
      trial: 7,
      basic: 30,
      premium: 90,
      elite: 365
    };

    const currentExpiry = member.expiryDate > new Date() ? member.expiryDate : new Date();
    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(newExpiry.getDate() + (packageDurations[packageType] || 30));

    // Update member
    member.packageType = packageType;
    member.expiryDate = newExpiry;
    member.membershipStatus = 'active';
    member.paymentHistory.push({
      amount: paymentAmount,
      paymentMethod,
      transactionId,
      date: new Date()
    });

    await member.save();

    res.json({
      success: true,
      message: 'Membership renewed successfully',
      data: member
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
  getMemberStats,
  renewMembership
};