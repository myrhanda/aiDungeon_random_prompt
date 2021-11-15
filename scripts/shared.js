// Any functions you define here will be available in your other modifier scripts.

function bringJoy(string) {
  return string.replace(/\b(sad|angry)\b/g, 'happy')
}
