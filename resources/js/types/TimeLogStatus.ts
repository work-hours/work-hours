/**
 * Time Log Status Enum
 * This should match the PHP enum App\Enums\TimeLogStatus
 */
export enum TimeLogStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Get all available statuses as an array of [value, label] tuples
 */
export const timeLogStatusOptions = [
  { id: TimeLogStatus.PENDING, name: 'Pending' },
  { id: TimeLogStatus.APPROVED, name: 'Approved' },
  { id: TimeLogStatus.REJECTED, name: 'Rejected' },
];

/**
 * Get all available statuses as an array of values
 */
export const timeLogStatusValues = Object.values(TimeLogStatus);
