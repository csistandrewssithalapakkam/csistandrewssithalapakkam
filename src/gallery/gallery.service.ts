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
        'https://drive.google.com/thumbnail?id=1hXO0UIyqVToz8tfERrLVPDAo3uB5OwU1&sz=w2000',
        'https://drive.google.com/thumbnail?id=1FXXD-4VJ-69E9n9INh-erELvL2catIyf&sz=w2000'
      ],
    },
    {
      name: 'Christmas Carols 2025',
      images: [
        'https://drive.google.com/thumbnail?id=1B2F-8iCdTaDUklvljmdPhFCBHTLmz1ft&sz=w2000',
        'https://drive.google.com/thumbnail?id=1rCdej3HDIw0jBY3HDqf8ETaiJSZ_3J3p&sz=w2000',
        'https://drive.google.com/thumbnail?id=1PxLSp3rDnUqvkNjHlHb9g-eb13koLkat&sz=w2000',
        'https://drive.google.com/thumbnail?id=1keT71NcBG6EQjycIw9gVaDZe_MPlmyd4&sz=w2000',
        'https://drive.google.com/thumbnail?id=1XQ4Uz5lWP0qbnRXKy1gJqTsNLp6bwvjK&sz=w2000',
        'https://drive.google.com/file/d/107LNDkxmdnd4dqZg-mPDlG_xrlsn1D_m/preview',
        'https://drive.google.com/file/d/1ct3O8Qg1voIW5pbs22GKQye4gsq-RYgC/preview',
        'https://drive.google.com/thumbnail?id=1XhtUIAQBdNwtZMUHNfn4y1A1CMXm7KZY&sz=w2000',
        'https://drive.google.com/thumbnail?id=1cVlcI_aLJFTX2NjPZDPT8UGTEXcGX1E8&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Dcv4s2v7pr2yAfopQKJemHecQ1wcDPPP&sz=w2000',
        'https://drive.google.com/thumbnail?id=1-FEHW_81rUvvoV1xeGLBqCCCJdi6hOkJ&sz=w2000',
        'https://drive.google.com/thumbnail?id=1vlMJevVws3v5a32rt4JQHRDtQ2jFAmrN&sz=w2000',
        'https://drive.google.com/thumbnail?id=1NwnKqgC2nqbANoUM8oIBzrlj6xn1RwL7&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Kr_0NAmUVZ1wYfkEMceT5C5Xg47Tru2T&sz=w2000',
        'https://drive.google.com/thumbnail?id=1yN80tvU2i2FDlO_GiXXgWRPWbFnw6DEs&sz=w2000',
        'https://drive.google.com/thumbnail?id=1OF0UkQIAOhRgRcEaDssYj_XEYseNJ-_7&sz=w2000',
        'https://drive.google.com/thumbnail?id=1m6crRnS6ksY5y1PBeBtlzOCaTmTus71e&sz=w2000',
        'https://drive.google.com/thumbnail?id=1PxTI29JltcoQ_Ss1RPhAEwxVfPvCJKv5&sz=w2000',
        'https://drive.google.com/thumbnail?id=12LsZtwDIcbuYBqgzx_HCSKNyuKbEsX1Q&sz=w2000',
        'https://drive.google.com/thumbnail?id=1vj_0wv0pBSM0cxAdgp6ESxXQN4HxHmox&sz=w2000',
        'https://drive.google.com/thumbnail?id=11JGz-4531BgJjuJ_8ZgZcEWNfXpzXMNh&sz=w2000',
        'https://drive.google.com/thumbnail?id=1fLs388pUKGiIXsA7MVWxA15XRt7Up1Ys&sz=w2000',
        'https://drive.google.com/thumbnail?id=1nkj8lxTsDsnCi0v-U6XvhVN2jgrAixGN&sz=w2000',
        'https://drive.google.com/thumbnail?id=1L7Km48Nw43OIja0xbk5X_rXFULbsshKy&sz=w2000',
        'https://drive.google.com/thumbnail?id=1mDq6AfOd0huTqeV1rLP11iw20H_uW3u7&sz=w2000',
        'https://drive.google.com/thumbnail?id=1LPdV3fCadrpocqYPj41negvugA6eaRap&sz=w2000',
        'https://drive.google.com/thumbnail?id=1-MeYu3esYyCpPpLyyf138oIVyEBPhvDF&sz=w2000',
        'https://drive.google.com/thumbnail?id=1HcJjScpyNtgPQ5XpY4wkdvvcXkq89nh5&sz=w2000',
        'https://drive.google.com/thumbnail?id=1BXlyk5mb2xBR2mA4FdWh4dAVoPudxiNF&sz=w2000',
        'https://drive.google.com/thumbnail?id=1o4tWY8a4QejHmjDzmO5OTAkpZc8wL0Im&sz=w2000',
        'https://drive.google.com/thumbnail?id=10MWCbvRl6awIt9L4led7EtEePWWA3HGs&sz=w2000',
        'https://drive.google.com/thumbnail?id=1M2bcKRkD8R3uJXXQTNtEel9LTYExYCzy&sz=w2000',
        'https://drive.google.com/thumbnail?id=1WPBLK9SiLIiCJD1Qv1jiyOlnRMFWkWE0&sz=w2000',
        'https://drive.google.com/thumbnail?id=1AtoU05_0P7FaIx6G__17k7-G2w38llFT&sz=w2000',
        'https://drive.google.com/thumbnail?id=1lIcKIbXmwxkjhsxPLiBfO5PcaXYABdBY&sz=w2000',
        'https://drive.google.com/thumbnail?id=15Y85R9UlULzWn_-Ya79EwIj0TU7-dqrP&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Ip4nvabZup0VGik8Zz6Elo3XlIvBaRAz&sz=w2000',
        'https://drive.google.com/thumbnail?id=1GWTTGsMeyOCWSJWtTeoDv4ux_CFNifdE&sz=w2000',
        'https://drive.google.com/thumbnail?id=1UGlY8lpTsm9qX7IcK5tuy329wCKotKXw&sz=w2000',
        'https://drive.google.com/thumbnail?id=1YwTKOd9scov1nHrZC-hV9zrnRAyZlpbm&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Kt3kgxiUbUF5JxyHoKaUo7INGLBta6Pe&sz=w2000',
        'https://drive.google.com/thumbnail?id=16V4AmcH1hEpw0uiUmyVSoCqogqzcKIpC&sz=w2000',
        'https://drive.google.com/thumbnail?id=1B1wK42YHCoqOvcxNK3fZ7KvjU-uiY73F&sz=w2000',
        'https://drive.google.com/thumbnail?id=1NzGUiuyW99Qk7W970sK5EzCOypZ_G-ga&sz=w2000',
        'https://drive.google.com/thumbnail?id=1oao8i__gQPdjA9f2K9PN_YMEmgTptoj9&sz=w2000',
        'https://drive.google.com/thumbnail?id=1B0_rpmfXFIrrePXNQfGy7Mub786cTC5X&sz=w2000',
        'https://drive.google.com/thumbnail?id=1pqEmILXZz39PTs_GBZpNmvIUDgW6J00Z&sz=w2000',
        'https://drive.google.com/thumbnail?id=1tIZxyvkviGiJ3e0coZscFGT1jB6YhAoo&sz=w2000',
        'https://drive.google.com/thumbnail?id=1tuV68IIcSW3eRl-ldUdTopNpCH7uwUFj&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Q5Dut9YzowturqplCKCRZFdeoZdAf_5l&sz=w2000',
        'https://drive.google.com/thumbnail?id=1BWDYT8oMRR-J_fP7x1BnGGOaqFXR0DmZ&sz=w2000',
        'https://drive.google.com/thumbnail?id=1CzMwdnRAh3wIDYzMaAarsWPnPkPaVPbI&sz=w2000',
        'https://drive.google.com/thumbnail?id=1EnXAyRtgKdMvfPkYf4BivmbANb5whVV9&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Rw3J5_7rezaYv8bAPcTxNOgg2vHwXFfG&sz=w2000',
        'https://drive.google.com/thumbnail?id=1JKRZwO0d4rXU1jdh9ZC9HHNbFB-UinS1&sz=w2000',
        'https://drive.google.com/thumbnail?id=1OQSD72UoHUQJL0n4txd818pUxQDGEJDG&sz=w2000',
        'https://drive.google.com/thumbnail?id=1xr_L7dNAlFPusb5eClkjTfHhlE4VqcAM&sz=w2000',
        'https://drive.google.com/thumbnail?id=1bqUv3BWPBEupHrQUWuXgAKx6QlmOGgZA&sz=w2000',
        'https://drive.google.com/thumbnail?id=1uYN4I2YhNmcBtk-1TPpbY-3ngNAjGYVh&sz=w2000',
        'https://drive.google.com/thumbnail?id=1VT-xfNoKzsZpgBfjYNYFpw7ZuMrcrGg_&sz=w2000',
        'https://drive.google.com/thumbnail?id=1GPT_mk8XOWn73ZNyRoCWWDxeK994fY_E&sz=w2000',
        'https://drive.google.com/thumbnail?id=1cxoKLtFBlM-xqEEhT7AD5L1wC39X2l6T&sz=w2000',
        'https://drive.google.com/thumbnail?id=1H4TTmUvpTGbzSI3r4O-H9d60VoFSJn0m&sz=w2000',
        'https://drive.google.com/thumbnail?id=1IipDyHwU09laKgOShyCABj6dIQdL7t2J&sz=w2000',
        'https://drive.google.com/thumbnail?id=1XcHSp4X82EQVjkVabwUrObRtUfZ1zoJu&sz=w2000',
        'https://drive.google.com/thumbnail?id=1WNIT_mZpCZWTEMwBbvdXuzIAjztaKupO&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Lc0BmTei0J_R4hBUTR0g0qN9fVnHx44C&sz=w2000',
        'https://drive.google.com/thumbnail?id=1wsm_J_OGSSwcnt6C_R41x2-5TSVrGo58&sz=w2000',
        'https://drive.google.com/thumbnail?id=1F3V8ZuS5ZEqAnHKIy7Ej8PdnMlkTfElo&sz=w2000',
        'https://drive.google.com/thumbnail?id=1mZD525j04354f2rUYcYNWYPbOWvsyTx-&sz=w2000',
        'https://drive.google.com/thumbnail?id=1gZcQUJAmOzQ2ncpA27GtpAOOH6QF94UY&sz=w2000',
        'https://drive.google.com/thumbnail?id=1kEPj8rSlF3-cuMXl5MP0rMbv9v8zITfC&sz=w2000',
        'https://drive.google.com/thumbnail?id=1cOCQWMCfn8VaRt8yDiC_H1GfHB9Yjs3Q&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Qz4bJZRgdWKohsQ5JUtUsvTfcL8n8Xee&sz=w2000',
        'https://drive.google.com/thumbnail?id=1tTkzdfVXBs7HJYngaULE21z1UQ_Gy_aK&sz=w2000',
        'https://drive.google.com/thumbnail?id=1es8cI91FKDd5TIyCNsu1ANPPAhg_WcyL&sz=w2000',
        'https://drive.google.com/thumbnail?id=1oo85JwwbWJPgy53YljB6RU6JZLYlZnKQ&sz=w2000',
        'https://drive.google.com/thumbnail?id=1ZXMaOhcEVCzSePpIcbQGmkblkbBA7MEX&sz=w2000',
        'https://drive.google.com/thumbnail?id=14EZJmt6PDNNkX3oQEP3EAPqRPgOPLPZ5&sz=w2000',
        'https://drive.google.com/file/d/1GVW3BwuxQbvOcL7WS3TYm32E2MSOTbOf/preview',
        'https://drive.google.com/thumbnail?id=1FYFRptiiCefvA9xiySUQmlMNvm2IIAjK&sz=w2000',
        'https://drive.google.com/thumbnail?id=1chpIeiztGEB_f7fHpMFwJTr7tleltqyf&sz=w2000',
        'https://drive.google.com/thumbnail?id=16qD4ncVjqURdFk0wVwgovsCFRmwSWOdN&sz=w2000',
        'https://drive.google.com/thumbnail?id=1S62BamhNGvmoJqM7oxao7r1hyLNL7sc8&sz=w2000',
        'https://drive.google.com/thumbnail?id=1PAOIc_uhxserIoByo3npvHRxRMLzyjSQ&sz=w2000',
        'https://drive.google.com/thumbnail?id=1Fb-ev6ZYCWi9zu4NmAKGi7E8qVRNhvrC&sz=w2000',
        'https://drive.google.com/thumbnail?id=1jLzDe0MOoK7CROkK1BGkAm3zGCzVLFdI&sz=w2000',
        'https://drive.google.com/thumbnail?id=1bVTq7kd99pOpJzO3JqeeMc--A7nhJoC7&sz=w2000',
        'https://drive.google.com/thumbnail?id=12PhAIeC8TlxXOvr74C3GW3jLQnXeEG-M&sz=w2000',
        'https://drive.google.com/thumbnail?id=1NAkqH8UfEVOq2THuOLq_3sb4OmHUalO1&sz=w2000',
      ]
    }
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