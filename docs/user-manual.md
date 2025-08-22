# User guide — Vacances Tranquilles

This guide describes how to use the application for both clients and service providers.

---

## Purpose of the application

**Vacances Tranquilles** connects travellers with trusted providers for home services, bookings, and easy holiday management.

---

## User profiles

The application includes 3 types of users:

- General user (all roles)
- Client (particulier)
- Provider (prestataire)

---

### General user

- Registers
- Logs in and out
- Views and edits their profile
- Accesses the support section
- Uses the integrated messaging system

---

### Client

- Searches for available services by date, category, and location
- Views service provider profiles
- Confirms a booking via the integrated payment system
- Manages a list of their bookings
- Can cancel a booking and potentially receive a full or partial refund depending on notice
- Gets notified in case of cancellation or rejection by the provider
- Rates the provider after service completion

---

#### Typical client journey

1. Signs up as a client  
2. Logs into their personal space  
3. Searches for a service by entering filters  
4. Views the list of available providers  
5. Checks each profile to make a decision  
6. Books a service via secure payment  
7. Waits for provider confirmation  
8. Uses the messaging system to communicate  
9. Leaves a rating after service completion  

---

### Service provider

- Signs up by providing a valid SIRET/SIREN number  
- Offers services independently  
- Gets notified of new requests and can accept or decline  
- Manages their booking list  
- Cancels a service if needed  
- Gets notified and possibly compensated in case of cancellation  

---

#### Typical provider journey

1. Signs up as a provider
2. Logs into their personal space 
3. Completes their profile with service details  
4. Receives client requests  
5. Reviews their reservation calendar  
6. Accepts or declines each request  
7. Uses messaging to talk with clients  
8. Performs the service  
9. Closes the reservation from the app  
10. Gets paid  

---

## Registration

During sign-up, the user must indicate whether they want to **offer services** (provider) or **book services** (client).  
All required fields must be filled in.  

Information can later be updated in the user profile, with optional fields available.  

At any time, a user may request account deletion via the support form.

---

## Login

Once registered, users can log in using their email and password.

---

## Service search

Clients can search for services from the homepage after logging in.  

Filters include:
- Type of service (cleaning, gardening, etc.)
- Desired date and time
- Location

The results list displays providers matching the criteria.

---

## List of available providers

Clients can view a provider’s profile, which includes:

- Full name
- Ratings and reviews
- Pricing

They can then click **“Book”** to submit a reservation request.

---

## Payment

**Payment is required to validate a booking.**

When a client selects a provider and confirms, they are redirected to a secure payment interface.

Details:
- The displayed price matches the provider’s service fee
- Payment is processed online through a secure payment provider (Stripe)
- Once payment is confirmed, the provider must confirm the booking in their dashboard

The provider is paid after confirming that the service has been completed.

---

## Profile

Each user has a personal space accessible after login.

They can:
- View and edit personal information
- Add or remove optional details

---

## My bookings

Each user has a dedicated section to view their reservations.

For clients:
- Bookings may show as:
  - “Pending”: awaiting provider confirmation
  - “Confirmed”: provider has accepted

For providers:
- Incoming requests can be accepted or declined from this page.

Once accepted, both users can start a conversation from this page, which can later be accessed in the **Messaging** section.

Once the service is completed, the provider must **close the booking** from this page.  
This action triggers a request for the client to leave a review, helping future users choose.

---

## Messaging

Messaging is available for clients and providers **from the moment a booking is accepted until the provider marks it as completed** .

---

## Cancelling a service

Cancellations must be made via a written request using the contact form.

**Client side:**

The refund amount depends on how early the cancellation occurs relative to the scheduled date:
- **More than 3 days before**: 100% refund
- **Between 2 and 3 days**: 50% refund
- **Less than 2 days**: no refund

**Provider side:**

The cancellation will be recorded. The **cancellation frequency** will be visible on their profile and may affect their reliability rating.

---

## Support

Several support options are available:
- Review the Terms of Use
- Review the Terms of Sale
- Ask the chatbot
- Submit a support request via the contact form

---

## Account and data security

- Each user account is secured by login credentials  
- Only logged-in users can access their personal data  
- Messages are private and only visible to the two parties involved  
- No personal information is shared unless a connection exists between users  

---

## Updates

This guide is updated regularly to reflect functional changes in the application.
