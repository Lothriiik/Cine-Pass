package bookings

import (
	"context"
	"testing"
	"time"

	"github.com/StartLivin/screek/backend/internal/shared/events"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCancelTicketWithRefund(t *testing.T) {
	repo := new(MockBookingsRepo)
	paySvc := new(MockPayment)
	bus := events.NewEventBus()
	service := NewService(repo, nil, paySvc, nil, nil, nil, bus)

	userID := uuid.New()
	ticketID := uuid.New()
	sessionID := 1
	txID := uuid.New()

	ticket := &Ticket{
		ID:            ticketID,
		SessionID:     sessionID,
		TransactionID: txID,
		Status:        "PAID",
		Transaction: Transaction{
			ID:        txID,
			UserID:    userID,
			PaymentID: "pi_123",
		},
	}

	repo.On("GetTicketDetail", mock.Anything, ticketID, userID).Return(ticket, nil)
	repo.On("CancelTicket", mock.Anything, ticketID, userID).Return(nil)
	paySvc.On("RefundPayment", mock.Anything, "pi_123").Return(nil)

	err := service.CancelTicket(context.Background(), ticketID, userID)

	assert.NoError(t, err)
	repo.AssertExpectations(t)
	paySvc.AssertExpectations(t)
}

func TestConfirmPaymentWebhookPublishEvent(t *testing.T) {
	repo := new(MockBookingsRepo)
	bus := events.NewEventBus()
	service := NewService(repo, nil, nil, nil, nil, nil, bus)

	transactionID := uuid.New()
	userID := uuid.New()
	tID := uuid.New()

	transaction := &Transaction{
		ID:      transactionID,
		UserID:  userID,
		Status:  "PENDING",
		Tickets: []uuid.UUID{tID},
	}

	ticket := &Ticket{
		ID:            tID,
		TransactionID: transactionID,
		QRCode:        "123",
	}

	repo.On("PayTransaction", mock.Anything, transactionID, userID, "STRIPE", "pi_456").Return(nil)
	repo.On("GetTransactionByID", mock.Anything, transactionID, userID).Return(transaction, nil)
	repo.On("GetTicketDetail", mock.Anything, tID, userID).Return(ticket, nil)

	eventReceived := make(chan bool, 1)
	bus.Subscribe(events.EventTicketPurchased, func(payload any) {
		eventReceived <- true
	})

	err := service.ConfirmPaymentWebhook(context.Background(), transactionID, userID, "STRIPE", "pi_456")

	assert.NoError(t, err)

	select {
	case <-eventReceived:
	case <-time.After(1 * time.Second):
		t.Fatal("Event TicketPurchased was not published")
	}

	repo.AssertExpectations(t)
}
