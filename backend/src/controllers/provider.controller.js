const ServiceProvider = require('../models/sprovider.model');

exports.getMe = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.serviceprovider._id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const allowed = [
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'pincode',
      'serviceArea', 'experience', 'visitingCost', 'businessName', 'businessType', 'gstNumber', 'description'
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.serviceprovider._id,
      updates,
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New: set availability (toggle or explicit)
exports.setAvailability = async (req, res) => {
  try {
    const providerId = req.serviceprovider._id;
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const { isAvailable } = req.body;
    // If caller provided explicit boolean, use it; otherwise toggle
    const newStatus = typeof isAvailable === 'boolean' ? isAvailable : !provider.isAvailable;

    provider.isAvailable = newStatus;
    await provider.save();

    res.status(200).json({ message: 'Availability updated', isAvailable: provider.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};