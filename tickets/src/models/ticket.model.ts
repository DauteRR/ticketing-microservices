import { Document, Model, model, Schema } from 'mongoose';
import { CreateTicketDto } from '../dtos/tickets.dto';

interface TicketAttrs extends CreateTicketDto {
  userId: string;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

export interface TicketDocument extends Document, TicketAttrs {}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: (document: TicketDocument, ret: Partial<TicketDocument>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

export const Ticket = model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);
