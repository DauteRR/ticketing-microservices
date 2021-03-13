interface CurrentUser {
  email: string;
  id: string;
}

interface CurrentUserResponse {
  currentUser: CurrentUser | null;
}

interface SignInRequestBody {
  email: string;
  password: string;
}

interface SignInResponse {
  email: string;
  id: string;
}

interface SignUpRequestBody {
  email: string;
  password: string;
}

interface SignUpResponse {
  email: string;
  id: string;
}

interface SignOutRequestBody {}

interface SignOutResponse {}

interface CreateTicketRequestBody {
  title: string;
  price: string;
}

interface Ticket {
  price: number;
  title: string;
  userId: string;
  id: string;
}

type CreateTicketResponse = Ticket;

type GetTicketsResponse = Ticket[];

interface Order {
  expiresAt: string;
  id: string;
  status: string;
  ticket: Pick<Ticket, 'id' | 'price' | 'title'>;
  userId: string;
}

type GetOrdersResponse = Order[];

interface CreateOrderRequestBody {
  ticketId: string;
}

type CreateOrderResponse = Order;

interface PaymentRequestBody {
  orderId: string;
  token: string;
}

interface PaymentResponse {}
