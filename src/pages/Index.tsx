import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import BookingCalendar from '@/components/BookingCalendar';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/6d5c4aaf-86de-49be-8f22-28732051ccd7/bucket/1ac27bd6-09f3-44f4-beef-f5e263034e3d.jpg';

const ROOMS = [
  {
    id: 1,
    name: 'Стандарт',
    area: 'от 20 м²',
    price: 4200,
    capacity: 2,
    image: HERO_IMAGE,
    features: ['Панорамное окно', 'Kitchenette', 'Smart TV'],
    badge: 'Популярный',
    badgeColor: 'bg-gold text-black',
  },
  {
    id: 2,
    name: 'Комфорт',
    area: 'от 25 м²',
    price: 6800,
    capacity: 3,
    image: HERO_IMAGE,
    features: ['Отдельная спальня', 'Полная кухня', 'Рабочая зона'],
    badge: 'Бизнес',
    badgeColor: 'bg-cyan text-black',
  },
  {
    id: 3,
    name: 'Люкс',
    area: 'от 27 м²',
    price: 12500,
    capacity: 5,
    image: HERO_IMAGE,
    features: ['Вид на город 270°', '2 спальни', 'Джакузи'],
    badge: 'Люкс',
    badgeColor: 'bg-primary text-primary-foreground',
  },
  {
    id: 4,
    name: 'Двухэтажный люкс',
    area: '35 м²',
    price: 18900,
    capacity: 6,
    image: HERO_IMAGE,
    features: ['2 этажа', 'Терраса', 'Личный butler'],
    badge: 'Эксклюзив',
    badgeColor: 'bg-gold text-black',
  },
];

const SERVICES = [
  { icon: 'Wifi', title: 'Высокоскоростной Wi-Fi', desc: 'До 500 Мбит/с во всех апартаментах' },
  { icon: 'Car', title: 'Паркинг', desc: 'Подземный паркинг с видеонаблюдением' },
  { icon: 'UtensilsCrossed', title: 'Завтрак', desc: 'Континентальный завтрак до 11:00' },
  { icon: 'Dumbbell', title: 'Фитнес-зал', desc: 'Тренажёрный зал 24/7' },
  { icon: 'Wind', title: 'Климат-контроль', desc: 'Индивидуальный климат в каждом номере' },
  { icon: 'ShieldCheck', title: 'Охрана 24/7', desc: 'Круглосуточная служба безопасности' },
  { icon: 'Shirt', title: 'Прачечная', desc: 'Прачечная и химчистка' },
  { icon: 'ConciergeBell', title: 'Консьерж', desc: 'Помощь в организации досуга и трансферов' },
];

const GALLERY = [
  HERO_IMAGE, HERO_IMAGE, HERO_IMAGE, HERO_IMAGE, HERO_IMAGE, HERO_IMAGE,
];

const REVIEWS = [
  {
    name: 'Анна Соколова',
    date: 'Март 2026',
    stars: 5,
    text: 'Невероятный вид из окна! Апартаменты полностью оборудованы всем необходимым. Буду возвращаться снова.',
    avatar: 'АС',
  },
  {
    name: 'Игорь Петров',
    date: 'Февраль 2026',
    stars: 5,
    text: 'Отличное расположение, современный дизайн интерьера. Очень удобно для деловых поездок.',
    avatar: 'ИП',
  },
  {
    name: 'Мария Белова',
    date: 'Январь 2026',
    stars: 4,
    text: 'Стильное место с прекрасным сервисом. Персонал очень внимательный и отзывчивый.',
    avatar: 'МБ',
  },
];

const NAV_LINKS = [
  { label: 'Номера', href: '#rooms' },
  { label: 'Бронирование', href: '#booking' },
  { label: 'Услуги', href: '#services' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', comment: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const selectedRoomData = ROOMS.find(r => r.id === selectedRoom);
  const totalPrice = selectedRoomData ? selectedRoomData.price * getNights() : 0;

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      setSendError('Пожалуйста, заполните имя и телефон');
      return;
    }
    setSending(true);
    setSendError('');
    try {
      const res = await fetch('https://functions.poehali.dev/2f179cf3-3807-4d44-a6c4-7b91d8c39e8d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          comment: formData.comment,
          room: selectedRoomData?.name || '',
          checkIn: checkIn ? checkIn.toLocaleDateString('ru-RU') : '',
          checkOut: checkOut ? checkOut.toLocaleDateString('ru-RU') : '',
          nights: getNights() || '',
          guests,
          total: totalPrice || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setFormData({ name: '', phone: '', email: '', comment: '' });
      } else {
        setSendError('Ошибка отправки. Попробуйте позвонить нам.');
      }
    } catch {
      setSendError('Ошибка соединения. Попробуйте позвонить нам.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-cormorant text-2xl font-bold tracking-widest text-gold uppercase">
            AURA<span className="text-foreground mx-1">·</span>APART
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="nav-link text-sm font-golos font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo('#booking')}
            className="hidden md:flex items-center gap-2 bg-gold text-black text-sm font-golos font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity glow-gold"
          >
            <Icon name="CalendarDays" size={15} />
            Забронировать
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-foreground">
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border px-6 py-4 space-y-3 animate-fade-in">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-left text-sm font-golos font-medium text-muted-foreground hover:text-foreground py-2 transition-colors">
                {l.label}
              </button>
            ))}
            <button onClick={() => scrollTo('#booking')} className="w-full bg-gold text-black text-sm font-golos font-semibold py-3 rounded-full mt-2">
              Забронировать
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        <div className="absolute top-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent animate-pulse-glow opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-cyan to-transparent animate-pulse-glow opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-16 w-2 h-2 rounded-full bg-gold animate-float opacity-70" />
        <div className="absolute top-1/3 right-48 w-1.5 h-1.5 rounded-full bg-cyan animate-float opacity-50" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-32 pt-40">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em] mb-6 border border-gold/30 px-4 py-2 rounded-full bg-gold/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Апарт-отель «AURA»
              </span>
            </div>

            <h1 className="font-cormorant text-6xl md:text-8xl font-light leading-none text-foreground mb-2 animate-fade-in-up-delay-1">
              Живи<br />
              <em className="text-gold not-italic">в ритме</em><br />
              города
            </h1>

            <p className="font-golos text-base md:text-lg text-muted-foreground mt-6 mb-10 leading-relaxed max-w-xl animate-fade-in-up-delay-2">
              Апартаменты с панорамным видом на город. Пространство, созданное для тех, кто ценит время и комфорт.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-3">
              <button
                onClick={() => scrollTo('#booking')}
                className="inline-flex items-center justify-center gap-2 bg-gold text-black font-golos font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all hover:scale-105 glow-gold text-sm"
              >
                <Icon name="CalendarDays" size={16} />
                Забронировать номер
              </button>
              <button
                onClick={() => scrollTo('#rooms')}
                className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground font-golos font-medium px-8 py-4 rounded-full hover:border-gold hover:text-gold transition-colors text-sm"
              >
                <Icon name="Grid3x3" size={16} />
                Смотреть номера
              </button>
            </div>

            <div className="flex gap-8 mt-12 animate-fade-in-up-delay-3">
              {[['150+', 'Апартаментов'], ['4.9', 'Рейтинг'], ['2 000+', 'Гостей']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-cormorant text-3xl font-bold text-gold">{n}</div>
                  <div className="font-golos text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <button onClick={() => scrollTo('#rooms')} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors">
            <span className="text-xs font-golos uppercase tracking-widest">Листать</span>
            <Icon name="ChevronDown" size={18} />
          </button>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em]">Наши номера</span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2">
              Выберите <em className="text-gold not-italic">пространство</em>
            </h2>
            <p className="font-golos text-muted-foreground mt-3 max-w-xl">
              Каждый апартамент оснащён всем необходимым для комфортного проживания — от уютного студио до просторного пентхауса.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.map((room, i) => (
              <div
                key={room.id}
                className="bg-hotel-card border border-border rounded-2xl overflow-hidden card-hover cursor-pointer group"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => scrollTo('#booking')}
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-4 right-4 text-xs font-golos font-semibold px-3 py-1 rounded-full ${room.badgeColor}`}>
                    {room.badge}
                  </span>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-cormorant text-2xl font-semibold">{room.name}</div>
                    <div className="font-golos text-sm opacity-80">{room.area}</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.map(f => (
                      <span key={f} className="text-xs font-golos text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 mb-4 text-muted-foreground">
                    <Icon name="Users" size={14} />
                    <span className="text-xs font-golos">до {room.capacity} гостей</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-cormorant text-3xl font-bold text-gold">{room.price.toLocaleString('ru-RU')}</span>
                      <span className="font-golos text-xs text-muted-foreground ml-1">₽ / ночь</span>
                    </div>
                    <button className="bg-gold text-black text-xs font-golos font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                      Выбрать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="mb-14">
            <span className="text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em]">Онлайн бронирование</span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2">
              Забронируйте <em className="text-gold not-italic">сейчас</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="mb-4">
                <p className="text-sm font-golos text-muted-foreground mb-1">
                  {!checkIn ? '① Выберите дату заезда' : !checkOut ? '② Выберите дату выезда' : '✓ Даты выбраны'}
                </p>
                <p className="text-xs font-golos text-muted-foreground/60">Зачёркнутые даты — уже заняты</p>
              </div>
              <BookingCalendar onDatesSelected={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />
            </div>

            <div className="bg-hotel-card border border-border rounded-2xl p-6 space-y-5">
              <h3 className="font-cormorant text-2xl font-semibold text-foreground">Детали бронирования</h3>

              <div>
                <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Тип номера
                </label>
                <div className="space-y-2">
                  {ROOMS.map(room => (
                    <label
                      key={room.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border hover:border-gold/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="room"
                          value={room.id}
                          checked={selectedRoom === room.id}
                          onChange={() => setSelectedRoom(room.id)}
                          className="accent-gold"
                        />
                        <div>
                          <div className="font-golos text-sm font-medium text-foreground">{room.name}</div>
                          <div className="font-golos text-xs text-muted-foreground">{room.area} · до {room.capacity} гостей</div>
                        </div>
                      </div>
                      <span className="font-cormorant text-lg font-bold text-gold">{room.price.toLocaleString('ru-RU')} ₽</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Гостей
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors text-foreground"
                  >
                    <Icon name="Minus" size={14} />
                  </button>
                  <span className="font-cormorant text-2xl font-semibold text-foreground w-8 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(g => Math.min(5, g + 1))}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-gold transition-colors text-foreground"
                  >
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                />
                <input
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                />
                <textarea
                  placeholder="Пожелания (необязательно)"
                  value={formData.comment}
                  onChange={e => setFormData(f => ({ ...f, comment: e.target.value }))}
                  rows={2}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              {getNights() > 0 && selectedRoom && (
                <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm font-golos">
                    <span className="text-muted-foreground">{selectedRoomData?.name}</span>
                    <span className="text-foreground">{selectedRoomData?.price.toLocaleString('ru-RU')} ₽ × {getNights()} ночей</span>
                  </div>
                  <div className="flex justify-between font-golos border-t border-gold/20 pt-2">
                    <span className="text-sm font-semibold text-foreground">Итого</span>
                    <span className="text-gold font-cormorant text-2xl font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              )}

              {sendError && (
                <p className="text-red-400 text-xs font-golos text-center">{sendError}</p>
              )}

              {sent ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="font-cormorant text-xl font-semibold text-green-400 mb-1">Заявка отправлена!</div>
                  <p className="font-golos text-xs text-muted-foreground">Мы свяжемся с вами в течение 15 минут.</p>
                  <button onClick={() => setSent(false)} className="mt-3 text-xs font-golos text-gold underline">Отправить ещё раз</button>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full bg-gold text-black font-golos font-semibold py-4 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] glow-gold flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
                >
                  <Icon name={sending ? 'Loader' : 'CalendarCheck'} size={18} className={sending ? 'animate-spin' : ''} />
                  {sending ? 'Отправляем...' : 'Отправить заявку'}
                </button>
              )}

              <p className="text-xs font-golos text-muted-foreground text-center">
                Без предоплаты. Менеджер свяжется в течение 15 минут.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em]">Инфраструктура</span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2">
              Всё включено <em className="text-gold not-italic">в стоимость</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="bg-hotel-card border border-border rounded-2xl p-5 hover:border-gold/40 transition-all hover:-translate-y-1 group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon name={s.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-gold" />
                </div>
                <div className="font-golos text-sm font-semibold text-foreground mb-1">{s.title}</div>
                <div className="font-golos text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-cyan text-xs font-golos font-semibold uppercase tracking-[0.25em]">Интерьеры</span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2">
              Галерея
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ height: i === 0 ? '400px' : '190px' }}
                onClick={() => setActiveGallery(i)}
              >
                <img
                  src={img}
                  alt={`Галерея ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Icon name="ZoomIn" size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeGallery !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveGallery(null)}
          >
            <button className="absolute top-6 right-6 text-white/60 hover:text-white">
              <Icon name="X" size={28} />
            </button>
            <img
              src={GALLERY[activeGallery]}
              alt=""
              className="max-w-5xl max-h-[85vh] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-6 flex gap-2">
              {GALLERY.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveGallery(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeGallery ? 'bg-gold' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em]">Отзывы</span>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2">
                Что говорят <em className="text-gold not-italic">гости</em>
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-2xl px-5 py-3">
              <div>
                <div className="font-cormorant text-4xl font-bold text-gold">4.9</div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="Star" size={12} className="text-gold fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-xs font-golos text-muted-foreground">
                На основе<br />200+ отзывов
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-hotel-card border border-border rounded-2xl p-6 hover:border-gold/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.stars)].map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-gold fill-current" />
                  ))}
                </div>
                <p className="font-golos text-sm text-muted-foreground leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center font-golos text-xs font-bold text-gold">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="font-golos text-sm font-semibold text-foreground">{r.name}</div>
                    <div className="font-golos text-xs text-muted-foreground">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs font-golos font-semibold uppercase tracking-[0.25em]">Контакты</span>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground mt-2 mb-8">
                Свяжитесь<br /><em className="text-gold not-italic">с нами</em>
              </h2>

              <div className="space-y-5">
                {[
                  { icon: 'MapPin', label: 'Адрес', value: 'Сочи, ул. Навагинская 11Б' },
                  { icon: 'Phone', label: 'Телефон', value: '8 (900) 237-97-57' },
                  { icon: 'Mail', label: 'Email', value: 'orangeapart@mail.ru' },
                  { icon: 'Clock', label: 'Ресепшн', value: '24/7 без выходных' },
                ].map(c => (
                  <div key={c.icon} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-gold" />
                    </div>
                    <div>
                      <div className="font-golos text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{c.label}</div>
                      <div className="font-golos text-sm font-medium text-foreground">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <a href="https://wa.me/79002379757" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-border text-sm font-golos font-medium text-muted-foreground px-4 py-2.5 rounded-full hover:border-gold hover:text-gold transition-colors">
                  <Icon name="MessageCircle" size={15} />
                  WhatsApp
                </a>
                <a href="https://t.me/+79002379757" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-border text-sm font-golos font-medium text-muted-foreground px-4 py-2.5 rounded-full hover:border-gold hover:text-gold transition-colors">
                  <Icon name="Send" size={15} />
                  Telegram
                </a>
                <a href="tel:+79002379757" className="flex items-center gap-2 border border-border text-sm font-golos font-medium text-muted-foreground px-4 py-2.5 rounded-full hover:border-gold hover:text-gold transition-colors">
                  <Icon name="Phone" size={15} />
                  Позвонить
                </a>
              </div>
            </div>

            <div className="bg-hotel-card border border-border rounded-2xl overflow-hidden h-80 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-cyan/5" />
              <div className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="MapPin" size={28} className="text-gold" />
                </div>
                <div className="font-cormorant text-2xl font-semibold text-foreground">AURA APART</div>
                <div className="font-golos text-sm text-muted-foreground mt-1">Сочи, ул. Навагинская 11Б</div>
                <button className="mt-4 text-xs font-golos font-medium text-gold border border-gold/30 px-4 py-2 rounded-full hover:bg-gold/10 transition-colors">
                  Открыть карту
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-cormorant text-xl font-bold tracking-widest text-gold uppercase">
            AURA<span className="text-foreground mx-1">·</span>APART
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-xs font-golos text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <div className="font-golos text-xs text-muted-foreground">
            © 2026 AURA APART. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}