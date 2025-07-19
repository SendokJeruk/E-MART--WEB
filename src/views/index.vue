<template>
  <header class="bg-gray-200 navbar-font shadow-xl">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <a class="block text-teal-600" href="#">
            <span class="sr-only">Home</span>
            <img src="@/assets/img/LOGO E-MART APP.png" alt="Logo" class="h-20 w-auto" />
          </a>
        </div>

        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" class="hidden md:block">
            <ul class="flex items-center gap-6 text-sm">
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a></li>
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Careers </a></li>
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> History </a></li>
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Services </a></li>
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a></li>
              <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a></li>
            </ul>
          </nav>

          <div class="flex items-center gap-4">
            <div class="sm:flex sm:gap-4">
              <div class="hidden sm:flex">
                <buttonred label="Login" to="/login" />
              </div>
              <div class="hidden sm:flex">
                <buttonred label="Register" to="/register" />
              </div>
            </div>

            <div class="block md:hidden">
              <button class="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="navbar-font text-6xl mt-7 p-7">
    <p>E-Mart 11</p>
  </div>

  <div class="p-4">
    <carousel :images="imagesA" />
  </div>

  <div class="relative h-20">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <buttonred class="h-13 w-full flex items-center justify-center navbar-font" label="Go To Storage Page" to="/dashboard" />
  </div>
</div>

<section id="tentang" class="px-4 py-12">
      <h2 class="text-3xl font-bold text-center text-[#7D0A0A] mb-8 navbar-font">Kenapa Harus E-Mart?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6 text-center navbar-font" data-aos="fade-up" data-aos-delay="200">
          <h3 class="text-xl font-semibold mb-2 ">🚀 Pengiriman Cepat</h3>
          <p>Kami memastikan barang sampai dengan aman dan cepat.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6 text-center navbar-font" data-aos="fade-up" data-aos-delay="400">
          <h3 class="text-xl font-semibold mb-2">🔒 Transaksi Aman</h3>
          <p>Keamanan data dan transaksi Anda adalah prioritas kami.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6 text-center navbar-font" data-aos="fade-up" data-aos-delay="600">
          <h3 class="text-xl font-semibold mb-2">🎉 Promo Menarik</h3>
          <p>Dapatkan penawaran spesial setiap hari.</p>
        </div>
      </div>

      <div class="mt-12" data-aos="fade-up" data-aos-delay="400">
        <h3 class="text-2xl font-semibold text-center navbar-font">Apa Kata Pelanggan?</h3>
        <div class="mt-6 flex flex-col gap-6 max-w-3xl mx-auto">
          <div class="bg-white rounded-lg shadow-2xl p-4 text-center navbar-font">
            <p class="text-gray-700">"E-Mart adalah toko terbaik! Produk berkualitas, pengiriman cepat!"</p>
            <p class="font-bold mt-2">- Rizky, Jakarta</p>
          </div>
          <div class="bg-white rounded-lg shadow-2xl p-4 text-center navbar-font">
            <p class="text-gray-700">"Sangat puas dengan pelayanan E-Mart! 100% recommended!"</p>
            <p class="font-bold mt-2">- Siti, Bandung</p>
          </div>
        </div>
      </div>
    </section>

  <footer class="bg-[#7D0A0A] text-white py-6 mt-12 text-center ">
    <p>&copy; 2025 E-Mart. Semua Hak Dilindungi.</p>
    <div class="mt-2 flex justify-center gap-4 text-sm">
      <a href="#" class="hover:underline navbar-font">Kontak</a>
      <a href="#" class="hover:underline navbar-font">Tentang Kami</a>
      <a href="#" class="hover:underline navbar-font">Kebijakan Privasi</a>
    </div>
  </footer>
</template>

<script setup>
import buttonred from '@/components/button/buttonred.vue';
import carousel from '@/components/card/carousel.vue';

const imagesA = [
    '/src/assets/img/carousel/wallpaperflare.com_wallpaper (1).jpg',
    '/src/assets/img/carousel/wallpaperflare.com_wallpaper (2).jpg',
    '/src/assets/img/carousel/wallpaperflare.com_wallpaper.jpg'
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.navbar-font {
    font-family: 'Righteous', cursive;
}
</style>
