import { Injectable, signal } from '@angular/core';

export interface GalleryCategory {
  name: string;
  images: string[];
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  galleryCategories = signal<GalleryCategory[]>([
    {
      name: 'Sunday School',
      images: [
        'https://picsum.photos/800/600?random=20',
        'https://picsum.photos/600/800?random=21',
        'https://picsum.photos/800/600?random=22',
        'https://picsum.photos/800/600?random=23',
      ],
    },
    {
      name: "Men's Fellowship",
      images: [
        'https://picsum.photos/800/600?random=10',
        'https://picsum.photos/600/800?random=11',
        'https://picsum.photos/800/600?random=12',
        'https://picsum.photos/800/600?random=13',
        'https://picsum.photos/600/800?random=14',
        'https://picsum.photos/800/600?random=15',
      ],
    },
    {
      name: 'Community Outreach',
      images: [
        'https://picsum.photos/800/600?random=30',
        'https://picsum.photos/600/800?random=31',
        'https://picsum.photos/800/600?random=32',
      ],
    },
    {
      name: 'Church Anniversary',
      images: [
        'https://picsum.photos/800/600?random=40',
        'https://picsum.photos/600/800?random=41',
        'https://picsum.photos/800/600?random=42',
        'https://picsum.photos/800/600?random=43',
        'https://picsum.photos/600/800?random=44',
      ],
    },
  ]);

  addCategory(categoryName: string) {
    if (!categoryName?.trim()) return;

    this.galleryCategories.update((categories) => {
      const categoryExists = categories.some(
        (cat) => cat.name.toLowerCase() === categoryName.trim().toLowerCase()
      );

      if (!categoryExists) {
        return [...categories, { name: categoryName.trim(), images: [] }];
      }
      return categories;
    });
  }

  addImage(categoryName: string, imageUrl: string) {
    if (!categoryName || !imageUrl) return;

    this.galleryCategories.update((categories) => {
      const categoryIndex = categories.findIndex(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (categoryIndex > -1) {
        // Add to existing category
        const updatedCategories = [...categories];
        const updatedCategory = { ...updatedCategories[categoryIndex] };
        updatedCategory.images = [...updatedCategory.images, imageUrl];
        updatedCategories[categoryIndex] = updatedCategory;
        return updatedCategories;
      } else {
        // Create new category
        return [...categories, { name: categoryName, images: [imageUrl] }];
      }
    });
  }

  removeImage(categoryName: string, imageUrl: string) {
    this.galleryCategories.update(categories => {
      return categories.map(category => {
        if (category.name === categoryName) {
          return {
            ...category,
            images: category.images.filter(img => img !== imageUrl)
          };
        }
        return category;
      });
    });
  }
}
