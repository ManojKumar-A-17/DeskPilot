import mongoose from 'mongoose';

const consultationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    query: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    response: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    category: {
      type: String,
      enum: ['Email', 'Network', 'Software', 'Hardware', 'Access', 'Security', 'General'],
      default: 'General'
    },
    resolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

consultationLogSchema.index({ createdAt: -1 });
consultationLogSchema.index({ user: 1, createdAt: -1 });

const ConsultationLog = mongoose.model('ConsultationLog', consultationLogSchema);

export default ConsultationLog;