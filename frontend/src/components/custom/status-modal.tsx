import React from 'react';
import { Check, X as XIcon, WarningCircle, Clock, X } from '@phosphor-icons/react';
import { Button } from '../ui/button';

export interface ReservationDetails {
  movieTitle: string;
  cinemaName: string;
  sessionTime: string;
  seats: string[];
}

export interface StatusModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'expired' | 'confirm';
  headerTitle?: string;
  title?: string; 
  description: string; 
  errorCode?: string | number;
  errorTechnicalDetails?: string;
  reservationDetails?: ReservationDetails;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  type,
  headerTitle,
  title,
  description,
  errorCode,
  errorTechnicalDetails,
  reservationDetails,
  primaryActionLabel = 'CERTO',
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';
  const isConfirm = type === 'confirm' || type === 'warning';
  const isExpired = type === 'expired';

  const displayHeaderTitle =
    headerTitle ||
    (isSuccess
      ? 'SUCESSO!'
      : isError
      ? 'ERROR'
      : isConfirm
      ? 'CONFIRMAR AÇÃO'
      : 'RESERVA EXPIRADA');

  const colorTheme = isSuccess
    ? {
        border: 'border-success',
        bg: 'bg-success/10',
        text: 'text-success dark:text-sucess',
        buttonBg: 'bg-success hover:bg-emerald-700 text-background ',
      }
    : isError
    ? {
        border: 'border-destructive',
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        buttonBg: 'bg-destructive hover:bg-destructive/90 text-background ',
      }
    : isConfirm
    ? {
        border: 'border-destructive',
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        buttonBg: 'bg-destructive hover:bg-destructive/90 text-background ',
      }
    : {
        border: 'border-primary',
        bg: 'bg-primary/10',
        text: 'text-primary',
        buttonBg: 'bg-primary hover:bg-primary/90 text-background',
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs font-display">
      <div className={`w-full max-w-[400px] bg-background text-foreground rounded-none border-4 ${colorTheme.border} shadow-[10px_10px_0px_0px_var(--border)] overflow-hidden animate-in fade-in zoom-in-95`}>
        <div className={`flex items-center justify-between border-b-4 ${colorTheme.bg} ${colorTheme.border} p-3.5 sm:p-4 px-5 sm:px-6`}>
          <div className="flex items-center gap-2.5">
            {isSuccess && <Check size={22} weight="bold" className={colorTheme.text} />}
            {isError && <X size={22} weight="bold" className={colorTheme.text} />}
            {isConfirm && <WarningCircle size={22} weight="bold" className={colorTheme.text} />}
            {isExpired && <Clock size={22} weight="fill" className={colorTheme.text} />}
            
            <h1 className={`text-base sm:text-lg font-display font-extrabold uppercase tracking-wide ${colorTheme.text}`}>
              {displayHeaderTitle}
            </h1>
          </div>

          <button
            onClick={onClose}
            className={`border-4 hover:bg-foreground/20 ${colorTheme.border} h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center ml-auto cursor-pointer transition-colors`}
            title="Fechar"
          >
            <XIcon size={18} className={colorTheme.text} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-2">
          {title && (
            <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {title}
            </h2>
          )}

          <p className="text-xs sm:text-sm font-bold text-foreground/60 leading-relaxed">
            {description}
          </p>

          {/* Technical Error Code Box (For Error Modals) */}
          {(isError || errorCode || errorTechnicalDetails) && (
            <div className="p-3 border-2 border-foreground/40 bg-foreground/5 font-mono text-xs font-bold text-foreground/80 space-y-1 my-3">
              <div>Error Code: {errorCode || '500'}</div>
              <div>Mensagem: {errorTechnicalDetails || 'Internal Server Error'}</div>
            </div>
          )}

          {/* Reservation Details Box (For Expired Reservation Modal matching Figma) */}
          {reservationDetails && (
            <div className="p-4 border-2 border-foreground/40 bg-foreground/5 font-mono text-center space-y-1.5 my-3">
              <div className="font-black text-foreground text-sm uppercase">{reservationDetails.movieTitle}</div>
              <div className="text-xs font-bold text-foreground/60">
                {reservationDetails.cinemaName} &nbsp; {reservationDetails.sessionTime}
              </div>
              <div className="text-xs font-extrabold text-primary pt-1">
                Assentos {reservationDetails.seats.join(' e ')} foram liberados
              </div>
            </div>
          )}

          {/* Buttons Footer for Expired Reservation vs Standard Modals */}
          {isExpired ? (
            <div className="flex flex-col space-y-2.5 pt-3">
              <button
                onClick={() => {
                  if (onPrimaryAction) onPrimaryAction();
                  onClose();
                }}
                className={`w-full py-3 text-xs font-display font-extrabold uppercase tracking-wider border-2 border-transparent transition-all cursor-pointer ${colorTheme.buttonBg}`}
              >
                {primaryActionLabel || '‹ ESCOLHER OUTROS ASSENTOS'}
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onSecondaryAction) onSecondaryAction();
                  onClose();
                }}
                className="w-full"
              >
                {secondaryActionLabel || 'VOLTAR ÀS SESSÕES'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-3 pt-3">
              <button
                onClick={() => {
                  if (onPrimaryAction) onPrimaryAction();
                  onClose();
                }}
                className={`px-5 py-2.5 text-xs font-display font-extrabold uppercase tracking-wider border-2 border-transparent transition-all cursor-pointer ${colorTheme.buttonBg}`}
              >
                {primaryActionLabel}
              </button>

              {secondaryActionLabel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onSecondaryAction) onSecondaryAction();
                    onClose();
                  }}
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

