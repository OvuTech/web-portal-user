'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface SeatSelectionProps {
  onClose: () => void;
  onContinue: (selectedSeats: number[]) => void;
  passengerCount: number;
}

type SeatStatus = 'available' | 'booked' | 'driver' | 'selected';

interface Seat {
  number: number;
  status: SeatStatus;
}

export function SeatSelection({ onClose, onContinue, passengerCount }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>([
    { number: 1, status: 'booked' },
    { number: 2, status: 'available' },
    { number: 3, status: 'available' },
    { number: 4, status: 'available' },
    { number: 5, status: 'booked' },
    { number: 6, status: 'booked' },
    { number: 7, status: 'available' },
    { number: 8, status: 'booked' },
    { number: 9, status: 'booked' },
    { number: 10, status: 'available' },
    { number: 11, status: 'available' },
    { number: 12, status: 'available' },
    { number: 13, status: 'available' },
    { number: 14, status: 'available' },
  ]);

  const driverSeat = { number: 0, status: 'driver' as SeatStatus };

  const handleSeatClick = (seatNumber: number) => {
    setSeats((prevSeats) => {
      const currentSelected = prevSeats.filter(s => s.status === 'selected').length;

      return prevSeats.map((seat) => {
        if (seat.number === seatNumber) {
          if (seat.status === 'available') {
            // Check if we've reached the passenger limit
            if (currentSelected >= passengerCount) {
              toast.warning(`You can only select ${passengerCount} seat${passengerCount > 1 ? 's' : ''} for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`);
              return seat;
            }
            return { ...seat, status: 'selected' as SeatStatus };
          } else if (seat.status === 'selected') {
            return { ...seat, status: 'available' as SeatStatus };
          }
        }
        return seat;
      });
    });
  };

  const handleContinue = () => {
    const selectedSeats = seats.filter((seat) => seat.status === 'selected').map((seat) => seat.number);

    // Validate that the correct number of seats is selected
    if (selectedSeats.length !== passengerCount) {
      toast.error(`Please select exactly ${passengerCount} seat${passengerCount > 1 ? 's' : ''} for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`);
      return;
    }

    onContinue(selectedSeats);
  };

  const getSeatImage = (status: SeatStatus) => {
    switch (status) {
      case 'selected':
        return '/selected.png';
      case 'driver':
        return '/driver.png';
      case 'available':
        return '/available.png';
      case 'booked':
        return '/booked.png';
      default:
        return '/available.png';
    }
  };

  const renderSeat = (seat: Seat | null, isDriver = false) => {
    if (!seat) {
      return <div className="h-[47px] w-[56px]"></div>;
    }

    const canClick = !isDriver && seat.status !== 'booked' && seat.status !== 'driver';

    return (
      <div
        className={`relative flex h-[47px] w-[56px] items-center justify-center ${
          canClick ? 'cursor-pointer transition-all hover:scale-105' : 'cursor-not-allowed'
        }`}
        onClick={() => canClick && handleSeatClick(seat.number)}
      >
        <Image
          src={getSeatImage(seat.status)}
          alt={seat.status}
          width={56}
          height={47}
          className="h-full w-full rounded-[5px] object-contain"
        />
        {seat.number > 0 && (
          <span className="absolute text-sm font-semibold text-white">{seat.number}</span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select Seat(s)</h2>
          <p className="text-sm text-gray-500">
            Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} for {passengerCount} passenger{passengerCount > 1 ? 's' : ''} (
            {seats.filter((seat) => seat.status === 'selected').length}/{passengerCount} selected)
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-8 rounded-[5px] bg-[#F1F8FC] px-5 py-4">
            <div className="flex flex-col items-center gap-2">
              <Image src="/selected.png" alt="Selected Seat" width={27} height={27} className="h-[26.5px] w-[27px] object-contain" />
              <span className="text-sm font-medium text-gray-900">Selected Seat</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image src="/driver.png" alt="Driver Seat" width={27} height={27} className="h-[26.5px] w-[27px] object-contain" />
              <span className="text-sm font-medium text-gray-900">Driver Seat</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image src="/available.png" alt="Available Seat" width={27} height={27} className="h-[26.5px] w-[27px] object-contain" />
              <span className="text-sm font-medium text-gray-900">Available Seat</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image src="/booked.png" alt="Booked Seat" width={27} height={27} className="h-[26.5px] w-[27px] object-contain" />
              <span className="text-sm font-medium text-gray-900">Booked Seat</span>
            </div>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="mb-8 flex justify-center">
          <div className="grid grid-cols-4 gap-[52px]">
            {/* Row 1 */}
            {renderSeat(driverSeat, true)}
            {renderSeat(null)}
            {renderSeat(null)}
            {renderSeat(seats.find((s) => s.number === 1) || null)}

            {/* Row 2 */}
            {renderSeat(seats.find((s) => s.number === 2) || null)}
            {renderSeat(seats.find((s) => s.number === 3) || null)}
            {renderSeat(seats.find((s) => s.number === 4) || null)}
            {renderSeat(null)}

            {/* Row 3 */}
            {renderSeat(seats.find((s) => s.number === 5) || null)}
            {renderSeat(seats.find((s) => s.number === 6) || null)}
            {renderSeat(null)}
            {renderSeat(seats.find((s) => s.number === 7) || null)}

            {/* Row 4 */}
            {renderSeat(seats.find((s) => s.number === 8) || null)}
            {renderSeat(seats.find((s) => s.number === 9) || null)}
            {renderSeat(null)}
            {renderSeat(seats.find((s) => s.number === 10) || null)}

            {/* Row 5 */}
            {renderSeat(seats.find((s) => s.number === 11) || null)}
            {renderSeat(seats.find((s) => s.number === 12) || null)}
            {renderSeat(seats.find((s) => s.number === 13) || null)}
            {renderSeat(seats.find((s) => s.number === 14) || null)}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="cursor-pointer rounded-lg bg-[#0A66C2] px-16 py-4 text-base font-semibold text-white transition-colors hover:bg-[#004182]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
