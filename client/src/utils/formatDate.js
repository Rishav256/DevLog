export const formatDate = (dateStr, style = 'short') => {
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' },
  };
  return new Date(dateStr).toLocaleDateString(
    'en-US',
    options[style] || options.short,
  );
};
