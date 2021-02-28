import { OrderStatus } from '@drrtickets/common';
import { Document, model, Model, Schema } from 'mongoose';

interface OrderAttrs {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDocument extends Document, OrderAttrs {}

interface OrderModel extends Model<OrderDocument> {
  build(id: string, attrs: OrderAttrs): OrderDocument;
}

const orderSchema = new Schema<OrderDocument, OrderModel>(
  {
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    versionKey: 'version',
    optimisticConcurrency: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

orderSchema.statics.build = (
  id: string,
  { userId, version, price, status }: OrderAttrs
) => {
  return new Order({
    _id: id,
    version,
    price,
    status,
    userId
  });
};

const Order = model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
