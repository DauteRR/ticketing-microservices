import { Model, Schema, Document, model } from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  chargeId: string;
}

interface PaymentDocument extends Document, PaymentAttrs {}

interface PaymentModel extends Model<PaymentDocument> {
  build(attrs: PaymentAttrs): PaymentDocument;
}

const paymentSchema = new Schema<PaymentDocument, PaymentModel>(
  {
    orderId: {
      type: String,
      required: true
    },
    chargeId: {
      type: Number,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = model<PaymentDocument, PaymentModel>('Payment', paymentSchema);

export { Payment };
