/**
 * Deskripsi panjang per halaman produk (≥150 kata) untuk SEO.
 * HANYA memakai fakta yang sudah ada di data produk & profil bisnis
 * (material, spesifikasi, finishing, proses fabrikasi). Tidak menambah
 * klaim harga, stok, atau angka yang belum terverifikasi.
 *
 * TODO(owner): spesifikasi/garansi pada tiap produk berasal dari data JSON.
 * Semua garansi sudah disamakan jadi "3 Tahun" di data & FAQ.
 */

export interface ProductContent {
  metaDescription: string;
  paragraphs: string[];
}

const content: Record<string, ProductContent> = {
  "meja-guru": {
    metaDescription:
      "Meja guru stainless steel custom dengan top HPL 25mm / kayu jati solid dan kaki profil 20x20mm. Dimensi 120x60x75cm, finishing BA. Produksi Solo.",
    paragraphs: [
      "Meja Guru dan Kabinet dari Rekayasa Manufaktur dirancang untuk menahan intensitas pemakaian harian di ruang kelas, ruang guru, maupun ruang kerja. Rangka kakinya dibuat dari stainless steel profil 20x20mm yang kokoh, sehingga meja tetap stabil meski sering dipindahkan atau digunakan dalam waktu lama. Konstruksi presisi ini membuat sambungan rapi dan permukaan mudah dirawat.",
      "Permukaan meja (top table) tersedia dalam pilihan HPL 25mm atau kayu jati solid, sesuai kebutuhan dan selera Anda. Kombinasi top table yang kuat dengan kaki stainless steel menghasilkan meja yang tahan lama sekaligus tampil bersih dan profesional. Finishing BA (Bright Annealed) atau powder coat membuat permukaan lebih terlindungi dan terlihat premium.",
      "Dimensi meja 120 x 60 x 75 cm dengan berat sekitar 12 kg — ukuran yang pas untuk satu pengguna dengan ruang kerja yang lega. Seluruh produk dapat dikustomisasi ukuran maupun finishing-nya oleh tim engineering kami. Diproduksi di workshop kami di Solo menggunakan proses pemotongan presisi dan pengelasan TIG, meja guru ini dikirim ke seluruh Indonesia dengan opsi pemasangan untuk area Jabodetabek.",
    ],
  },
  "trolley-s": {
    metaDescription:
      "Trolley S stainless steel serbaguna dengan rak bertingkat dan roda karet halus. Ringan 4,1 kg, kapasitas 30 kg, finishing powder coat. Produksi Solo.",
    paragraphs: [
      "Trolley S adalah trolley serbaguna berbentuk S dengan rak bertingkat dari stainless steel yang ringan namun kokoh. Konstruksinya memadukan profil stainless steel dengan shelf PP, menghasilkan trolley yang kuat menahan beban tanpa terasa berat saat didorong. Cocok digunakan di rumah, kafe, studio, maupun ruang kerja sebagai tempat menyimpan dan memindahkan barang sehari-hari.",
      "Trolley ini memiliki berat sekitar 4,1 kg dengan kapasitas hingga 30 kg, sehingga mudah dipindahkan sekaligus cukup kuat untuk membawa peralatan atau perlengkapan kerja. Roda karetnya halus sehingga tidak mudah merusak atau menandai permukaan lantai saat digunakan berpindah-pindah.",
      "Tersedia finishing powder coat dengan pilihan warna putih atau hitam yang memberikan perlindungan anti karat dan tampilan bersih. Dengan dimensi 42 x 25 x 80 cm dan susunan tiga tingkat, Trolley S membantu menata ruang agar lebih rapi dan efisien. Seperti semua produk kami, Trolley S dapat dikustomisasi dan diproduksi di workshop Rekayasa Manufaktur di Solo, lalu dikirim ke seluruh Indonesia dengan opsi pemasangan untuk Jabodetabek.",
    ],
  },
  "meja-kursi-belajar": {
    metaDescription:
      "Set meja & kursi belajar rangka stainless steel profil 40x40mm, top HPL 25mm anti-gores, kursi ergonomis. Dimensi meja 120x60x75cm. Produksi Solo.",
    paragraphs: [
      "Set Meja & Kursi Belajar dari Rekayasa Manufaktur adalah solusi furnitur untuk aktivitas belajar harian, baik di rumah maupun di kantor. Rangka mejanya dibuat dari stainless steel profil 40x40mm yang kokoh namun stabil, sehingga meja tidak bergoyang saat digunakan. Konstruksi presisi ini membuat setiap sambungan rapi dan tahan lama.",
      "Permukaan meja memakai top table HPL 25mm yang anti-gores, sehingga tetap terlihat bersih meski sering dipakai menulis atau meletakkan peralatan belajar. Kursinya menggunakan seat berbahan stainless steel dengan jok fabric yang ergonomis, memberikan kenyamanan saat duduk dalam waktu lama. Kombinasi ini menjadikan set ini praktis untuk ruang belajar maupun workstation.",
      "Dimensi mejanya 120 x 60 x 75 cm dengan finishing powder coat warna putih atau hitam yang melindungi permukaan dari karat sekaligus menyatu dengan berbagai gaya interior. Seluruh set dapat disesuaikan ukuran dan finishing-nya sesuai kebutuhan ruang Anda. Diproduksi di workshop kami di Solo dengan proses pemotongan dan pengelasan presisi, set meja-kursi belajar ini kami kirim ke seluruh Indonesia, dengan layanan pemasangan untuk area Jabodetabek.",
    ],
  },
  "tempat-tidur-susun-cabinet": {
    metaDescription:
      "Tempat tidur susun stainless steel custom, frame kokoh anti-karat, sambungan presisi tanpa gemeretak. Ukuran Queen 200x160x90cm, kapasitas 350 kg.",
    paragraphs: [
      "Tempat Tidur Susun Cabinet dari Rekayasa Manufaktur dibuat dengan frame stainless steel 4040 yang kokoh, anti-karat, dan tahan pemakaian jangka panjang. Rangka full stainless steel ini membuat ranjang tetap kuat dan bersih, sehingga cocok untuk kamar tidur, asrama, maupun hunian dengan kebutuhan tempat tidur tambahan.",
      "Setiap sambungan dirancang presisi agar tidak menimbulkan bunyi gemeretak saat digunakan. Finishing-nya rapi dengan powder coat matte yang memberikan perlindungan tambahan sekaligus tampilan modern yang tidak lekang waktu. Rangka ini juga mudah dibongkar dan dipasang ulang, praktis ketika Anda pindah rumah.",
      "Dengan ukuran 200 x 160 x 90 cm (Queen), berat sekitar 28 kg, dan kapasitas beban hingga 350 kg, tempat tidur ini menyeimbangkan kekuatan dengan ruang yang efisien. Konstruksinya dapat dikustomisasi sesuai ukuran dan kebutuhan ruang Anda. Diproduksi di workshop kami di Solo memakai proses fabrikasi presisi, tempat tidur susun ini dikirim ke seluruh Indonesia dengan opsi pemasangan untuk area Jabodetabek.",
    ],
  },
};

export function getProductContent(slug: string): ProductContent | undefined {
  return content[slug];
}
