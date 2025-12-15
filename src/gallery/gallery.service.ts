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
      name: 'Church Dedication - 20 Dec, 2023',
      images: [
        'https://i.ytimg.com/vi/LV6iBuavBLM/maxresdefault.jpg',
        'https://drive.google.com/thumbnail?id=1VjVeHHu5n5G-K2CAnhm9Xzo3q9K1-Laa&sz=w2000',
        'https://drive.google.com/thumbnail?id=1BWqpXSx-6ODcm_GYI8liptsb_CNI0Dy0&sz=w2000',
        'https://drive.google.com/thumbnail?id=1aoAwrTd1NVPejsJcFRWpI9RXb9BhbVPU&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Vb6fCl16Hbu7YcWJLnQlV0an_244wggm&sz=w2000',
        'https://drive.google.com/thumbnail?id=1oamw8LM7qU0JFsw13wfoQvI4QFiPRBTl&sz=w2000',
        'https://drive.google.com/thumbnail?id=1oamw8LM7qU0JFsw13wfoQvI4QFiPRBTl&sz=w2000',
        'https://drive.google.com/thumbnail?id=1hXO0UIyqVToz8tfERrLVPDAo3uB5OwU1&sz=w2000',
        'https://drive.google.com/thumbnail?id=1FXXD-4VJ-69E9n9INh-erELvL2catIyf&sz=w2000'
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