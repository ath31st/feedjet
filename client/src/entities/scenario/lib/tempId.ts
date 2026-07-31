let nextTempId = -1;

export function nextTempScenarioItemId(): number {
  return nextTempId--;
}
