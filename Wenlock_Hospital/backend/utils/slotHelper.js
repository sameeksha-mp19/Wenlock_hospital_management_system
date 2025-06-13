// simple overlap check: (A_start < B_end) && (A_end > B_start)
exports.isClashing = (slotStart, slotEnd, compareStart, compareEnd) =>
  slotStart < compareEnd && slotEnd > compareStart;