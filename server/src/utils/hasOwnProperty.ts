/**
 * Checks if an object has a specific property.
 * @param obj - The object to check.
 * @param prop - The property to check for.
 * @returns A type guard indicating whether the object has the specified property.
 */
export function hasOwnProperty<T, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
