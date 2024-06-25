const videoModel=require('../../models/video/video')
const playersModel=require('../../models/player/player')
const coachModel=require('../../models/coach/coach')
let authModel=require('../../models/auth/auth')
module.exports.dashboard = async (req, res) => {
    try {
let totalCoaches=await coachModel.find({}).count();
let totalPlayers=await playersModel.find({}).count();
let totalusers=await authModel.find({}).count()

      const videos = await videoModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);
  
      // Prepare response data
      const monthlyCounts = videos.map(item => ({
        month: item._id.month,
        year: item._id.year,
        count: item.count
      }));
      const users = await authModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);
  

      const userMonthlyCounts = users.map(item => ({
        month: item._id.month,
        year: item._id.year,
        count: item.count
      }));
      res.status(200).json({
        monthlyCounts,
        totalCoaches,
        totalPlayers,
        totalusers,
        userMonthlyCounts
      });
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  };