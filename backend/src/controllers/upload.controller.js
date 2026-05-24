const ServicePhoto = require('../models/servicePhoto.model');

async function uploadUserProfile  (req, res) {
  const user = req.user;
  user.profileImage = req.file.filename;
  await user.save();
  res.json({ profileImage: user.profileImage });
};


async function uploadProviderProfile (req, res) {
  const provider = req.serviceprovider;
  provider.profileImage = req.file.filename;
  await provider.save();
  res.json({ profileImage: provider.profileImage });
};

async function uploadServicePhoto (req, res) {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'photo file is required' });
    }
    const servicePhoto = new ServicePhoto({
      bookingId,
      photoUrl: req.file.filename
    });
    await servicePhoto.save();
    res.status(201).json({ id: servicePhoto._id, photoUrl: servicePhoto.photoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload service photo', error: error.message });
  }
};

module.exports = {
  uploadUserProfile, uploadProviderProfile, uploadServicePhoto
};