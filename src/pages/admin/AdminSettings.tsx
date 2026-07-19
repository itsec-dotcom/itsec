import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { upsertSiteSetting } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ImageUpload from '@/components/common/ImageUpload';

const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');

  // General settings
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Home Page settings
  const [heroBadge, setHeroBadge] = useState('');
  const [promoBrand, setPromoBrand] = useState('');
  const [promoBrandSubtitle, setPromoBrandSubtitle] = useState('');
  const [showPromoBrand, setShowPromoBrand] = useState(true);
  const [promoBottomTitle, setPromoBottomTitle] = useState('');
  const [promoBottomSubtitle, setPromoBottomSubtitle] = useState('');
  const [promoBottomImage, setPromoBottomImage] = useState('');
  const [showPromoBottom, setShowPromoBottom] = useState(true);

  const [loaderEnabled, setLoaderEnabled] = useState(true);
  const [loaderLogo, setLoaderLogo] = useState('');
  const [loaderText, setLoaderText] = useState('ITSEC.AZ');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSiteTitle(settings.site_title || 'itsec.az');
    setSiteLogo(settings.site_logo || '');
    setWhatsappNumber(settings.whatsapp_number || '994776117780');

    setHeroBadge(settings.hero_badge_text || 'Itsec.az security platform');
    setPromoBrand(settings.promo_brand || 'AVITEL');
    setPromoBrandSubtitle(settings.promo_brand_subtitle || 'Smart Security Cameras — Azerbaijan');
    setShowPromoBrand(settings.show_promo_brand !== 'false');
    
    setPromoBottomTitle(settings.promo_bottom_title || 'AcuSense & ColorVu Technology');
    setPromoBottomSubtitle(settings.promo_bottom_subtitle || 'Hikvision Smart Technology Center');
    setPromoBottomImage(settings.promo_bottom_image || 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f06aa236-b5fc-4d42-8af8-7425ce2f747f.jpg');
    setShowPromoBottom(settings.show_promo_bottom !== 'false');

    setLoaderEnabled(settings.loader_enabled !== 'false');
    setLoaderLogo(settings.loader_logo || '');
    setLoaderText(settings.loader_text || 'itsec.az');
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertSiteSetting('site_title', siteTitle, 'Website Title');
      await upsertSiteSetting('site_logo', siteLogo, 'Website Logo URL');
      await upsertSiteSetting('whatsapp_number', whatsappNumber, 'WhatsApp Number for Orders');
      
      await upsertSiteSetting('hero_badge_text', heroBadge, 'Hero Badge Text');
      await upsertSiteSetting('promo_brand', promoBrand, 'Promo Brand Name');
      await upsertSiteSetting('promo_brand_subtitle', promoBrandSubtitle, 'Promo Brand Subtitle');
      await upsertSiteSetting('show_promo_brand', showPromoBrand ? 'true' : 'false', 'Show Promo Brand Section');
      
      await upsertSiteSetting('promo_bottom_title', promoBottomTitle, 'Bottom Promo Title');
      await upsertSiteSetting('promo_bottom_subtitle', promoBottomSubtitle, 'Bottom Promo Subtitle');
      await upsertSiteSetting('promo_bottom_image', promoBottomImage, 'Bottom Promo Image');
      await upsertSiteSetting('show_promo_bottom', showPromoBottom ? 'true' : 'false', 'Show Bottom Promo Section');

      await upsertSiteSetting('loader_enabled', loaderEnabled ? 'true' : 'false', 'Enable Intro Loader');
      await upsertSiteSetting('loader_logo', loaderLogo, 'Intro Loader Logo URL');
      await upsertSiteSetting('loader_text', loaderText, 'Intro Loader Text');

      await refreshSettings();
      toast.success('Tənzimləmələr yadda saxlanıldı');
    } catch (err) {
      toast.error('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Tənzimləmələr</h1>
      </div>

      <div className="flex border-b border-border">
        <button 
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('general')}
        >Ümumi</button>
        <button 
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'home' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('home')}
        >Ana Səhifə (Promo)</button>
        <button 
          onClick={() => setActiveTab('loader')}
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'loader' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >Açılış Ekranı (Loader)</button>
      </div>

      <Card className="bg-card border-border p-6 max-w-2xl">
        <div className="space-y-6">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Saytın Başlığı (Title)</label>
                <Input 
                  value={siteTitle} 
                  onChange={e => setSiteTitle(e.target.value)} 
                  placeholder="itsec.az"
                  className="bg-muted border-border" 
                />
                <p className="text-xs text-muted-foreground mt-1">Brauzer tabında və saytın yuxarısında görünəcək ad.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Saytın Loqosu</label>
                <div className="mb-4">
                  {siteLogo ? (
                    <div className="flex items-center gap-4">
                      <div className="h-12 px-4 bg-muted border border-border rounded flex items-center justify-center">
                        <img src={siteLogo} alt="Logo" className="max-h-8 object-contain" />
                      </div>
                      <Button variant="ghost" onClick={() => setSiteLogo('')} className="text-destructive text-sm">Sil</Button>
                    </div>
                  ) : (
                    <div className="h-12 px-4 bg-muted border border-border rounded flex items-center justify-center">
                      <span className="font-bold text-lg text-foreground tracking-tight">{siteTitle}</span>
                    </div>
                  )}
                </div>
                <ImageUpload 
                  bucket="banners" 
                  path="logo" 
                  onUploaded={url => setSiteLogo(url)} 
                  label="Yeni loqo yüklə (PNG və ya SVG tövsiyə olunur)" 
                  aspectRatio="video" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">WhatsApp Sifariş Nömrəsi</label>
                <Input 
                  value={whatsappNumber} 
                  onChange={e => setWhatsappNumber(e.target.value)} 
                  placeholder="994776117780"
                  className="bg-muted border-border" 
                />
                <p className="text-xs text-muted-foreground mt-1">Sifarişlərin göndəriləcəyi WhatsApp nömrəsi (+ işarəsi olmadan yazın).</p>
              </div>
            </>
          )}

          {activeTab === 'home' && (
            <>
              <div className="pb-4 border-b border-border">
                <h3 className="text-base font-semibold mb-4 text-foreground">Slayder Üzərindəki Mətn (Badge)</h3>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Qırmızı kiçik başlıq</label>
                  <Input value={heroBadge} onChange={e => setHeroBadge(e.target.value)} className="bg-muted border-border" />
                </div>
              </div>

              <div className="pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">Premium Brend Bloku (Mərkəzi)</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowPromoBrand(!showPromoBrand)} className={showPromoBrand ? 'text-green-500' : 'text-destructive'}>
                    {showPromoBrand ? 'Aktiv (Gizlət)' : 'Gizlidir (Göstər)'}
                  </Button>
                </div>
                {showPromoBrand && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Brendin Adı</label>
                      <Input value={promoBrand} onChange={e => setPromoBrand(e.target.value)} placeholder="Məs: AVITEL" className="bg-muted border-border" />
                      <p className="text-xs text-muted-foreground mt-1">Bu brendə aid ən son 3 "Əla Seçim" (Featured) məhsul avtomatik bu blokda göstəriləcək.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Alt Başlıq</label>
                      <Input value={promoBrandSubtitle} onChange={e => setPromoBrandSubtitle(e.target.value)} className="bg-muted border-border" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">Aşağı Promo Bloku</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowPromoBottom(!showPromoBottom)} className={showPromoBottom ? 'text-green-500' : 'text-destructive'}>
                    {showPromoBottom ? 'Aktiv (Gizlət)' : 'Gizlidir (Göstər)'}
                  </Button>
                </div>
                {showPromoBottom && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Başlıq</label>
                      <Input value={promoBottomTitle} onChange={e => setPromoBottomTitle(e.target.value)} className="bg-muted border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Alt Başlıq (Badge)</label>
                      <Input value={promoBottomSubtitle} onChange={e => setPromoBottomSubtitle(e.target.value)} className="bg-muted border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Reklam Şəkli</label>
                      {promoBottomImage && (
                        <div className="mb-3 rounded overflow-hidden max-w-[200px] border border-border">
                          <img src={promoBottomImage} alt="Promo" className="w-full h-auto" />
                        </div>
                      )}
                      <ImageUpload bucket="banners" path="promo" onUploaded={url => setPromoBottomImage(url)} label="Yeni şəkil yüklə" aspectRatio="video" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'loader' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Saytın Açılış Animasiyası</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-border">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Açılış Ekranı Aktivdir</h4>
                      <p className="text-xs text-muted-foreground">Sayt ilk dəfə açılanda görünən yüklənmə animasiyası</p>
                    </div>
                    <Switch checked={loaderEnabled} onCheckedChange={setLoaderEnabled} />
                  </div>
                  
                  {loaderEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Xüsusi Loqo</label>
                        {loaderLogo && (
                          <div className="mb-3 rounded overflow-hidden max-w-[100px] bg-white p-2">
                            <img src={loaderLogo} alt="Loader" className="w-full h-auto" />
                          </div>
                        )}
                        <ImageUpload bucket="banners" path="settings" onUploaded={url => setLoaderLogo(url)} label="Loqo yüklə (PNG, SVG)" aspectRatio="square" />
                        <p className="text-[10px] text-muted-foreground mt-1">Xüsusi loqo yüklənməyibsə, sistemin standart kamerası animasiyası istifadə ediləcək.</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Açılış Mətni</label>
                        <Input value={loaderText} onChange={e => setLoaderText(e.target.value)} className="bg-muted border-border" />
                        <p className="text-[10px] text-muted-foreground mt-1">Məs: "itsec.az - təhlükəsizlik sistemləri saytına xoş gəlmisiniz"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-accent" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? 'Saxlanılır...' : <><Save size={16} className="mr-2" /> Yadda Saxla</>}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
