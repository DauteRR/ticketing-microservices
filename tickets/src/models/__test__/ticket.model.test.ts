import { Ticket, TicketDocument } from '../ticket.model';

describe('Ticket OCC', () => {
  it('increments the version number when an update occurs', async () => {
    let ticket = Ticket.build({
      price: 100,
      title: 'Concert',
      userId: '1'
    });

    expect(ticket.version).toBeUndefined();
    await ticket.save();

    ticket = (await Ticket.findById(ticket.id)) as TicketDocument;
    expect(ticket.version).toEqual(0);
    ticket.set({ price: 10 });
    await ticket.save();

    ticket = (await Ticket.findById(ticket.id)) as TicketDocument;
    expect(ticket.version).toEqual(1);
    ticket.set({ title: 'Special Concert' });
    await ticket.save();

    ticket = (await Ticket.findById(ticket.id)) as TicketDocument;
    expect(ticket.version).toEqual(2);
  });

  it('throws an error if the version does not match', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'Concert',
      userId: '1'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 120 });
    secondInstance!.set({ price: 80 });

    await firstInstance!.save();

    await expect(secondInstance!.save()).rejects.toThrow(/version/i);
  });
});
