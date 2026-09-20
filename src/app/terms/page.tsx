import type { Metadata } from "next";
import { LegalPage } from "../_components/LegalPage";

export const metadata: Metadata = { title: "Kullanım Koşulları", alternates: { canonical: "/terms" } };

export default function Page() { return <LegalPage title="Kullanım Koşulları"><p>Spor Toto Optimizasyon, kupon senaryolarını ve kolon maliyetlerini hesaplamaya yardımcı olur. Sonuç, ikramiye veya kazanç garantisi vermez; kullanıcı işlem öncesinde hesaplamayı ve güncel resmî kuralları doğrulamalıdır.</p><p>Hesap güvenliğini korumak, hukuka ve üçüncü kişi haklarına uygun kullanım sağlamak ve hizmeti aksatacak işlemler yapmamak kullanıcının sorumluluğundadır.</p><p>Varsa ücret, yenileme, iptal ve iade koşulları satın alma işleminden önce ilgili ekranda gösterilir.</p></LegalPage>; }
