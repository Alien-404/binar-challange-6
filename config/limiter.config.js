const limiter = {
  windowMs: 60 * 1000, // Periode waktu 1 menit (dalam milidetik)
  max: 20, // Jumlah maksimum permintaan selama periode waktu tersebut
  message: 'Terlalu banyak permintaan dari IP Anda. Silakan coba lagi nanti.',
};

module.exports = limiter;
