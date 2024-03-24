export class CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export class ContactResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export class UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}