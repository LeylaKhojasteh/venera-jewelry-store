import type { Metadata } from 'next';
import { getHomeContent } from '@/lib/catalog';
import { Hero } from '@/components/home/Hero';
import { BrandLine, CraftNotes, FinalCta, GenderPanels } from '@/components/home/EditorialSections';
import { CategoryMosaic } from '@/components/home/CategoryMosaic';
import { BestSellers, SaleSection } from '@/components/home/ProductSections';
import { StoryBand } from '@/components/home/StoryBand';

export const metadata: Metadata = {
  title: 'ونرا | زیورآلات معاصر — جزئیاتی که با تو می‌مانند',
  description:
    'کالکشن محدود گردنبند، دستبند، گوشواره و انگشتر ونرا؛ طراحی معاصر و مواد مشخص.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const { categories, bestSellers, discounted } = await getHomeContent();
  const feature = bestSellers.find((product) => product.categorySlug === 'necklace') ?? bestSellers[0];

  return (
    <>
      <Hero feature={feature} />
      <BrandLine />
      <CategoryMosaic categories={categories} />
      <BestSellers products={bestSellers} />
      <StoryBand />
      <GenderPanels />
      <SaleSection products={discounted} />
      <CraftNotes />
      <FinalCta />
    </>
  );
}
