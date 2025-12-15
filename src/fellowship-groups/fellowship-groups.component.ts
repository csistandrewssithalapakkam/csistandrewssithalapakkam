import { Component, ChangeDetectionStrategy } from '@angular/core';

interface FellowshipGroup {
  name: string;
  imageUrl: string;
  description: string[];
  inCharge: string;
}

@Component({
  selector: 'app-fellowship-groups',
  imports: [],
  templateUrl: './fellowship-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FellowshipGroupsComponent {
  fellowshipGroups: FellowshipGroup[] = [
    {
      name: 'Choir',
      imageUrl: 'https://drive.google.com/thumbnail?id=11m02RjNuqoo8jVRhmJi1Ic6nblJJaULM&sz=w2000',
      description: [
        'St. Andrew’s boasts a rich tradition of worship and prayer. Music plays a profoundly significant role within our sacred walls. Soul-stirring melodies, bring comfort to the depths of worshippers’ hearts, drawing people from all corners to join in joyful praise.',
        'Their harmonious voices elevate prayer and create a spiritual atmosphere. Additionally, during Lent and Advent, the Choir presents seasonal sacred music, adding to the richness of our worship experience.',
        'Beyond our Choir, we extend a warm invitation to all, together, we celebrate the beauty of music and its power to uplift our souls.',
      ],
      inCharge: 'Choirmaster & Organist –',
    },
    {
      name: 'Sunday School',
      imageUrl: 'https://drive.google.com/thumbnail?id=1wGslMLd9lwm6le3UPvH4cyA9vBdQge6N&sz=w2000',
      
      description: [
        'At St. Andrew’s Church, Sunday School is more than just education it’s a tool that helps our students develop a closer relationship with God through their connections with one another.',
        'Our Sunday School caters to children aged four through 12th grade. It provides an ideal environment for children to worship God and learn from the scriptures. The Sunday School curriculum is framed by the Diocese of Madras and the age-appropriate classes (Pre-school, Beginners, Juniors, Intermediates and Seniors) are led by dedicated and well-trained teachers. They meet every Sunday at 10:45am.',
      ],
      inCharge: 'Sunday School In-Charge –',
    },
    {
      name: 'Women’s Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=1rit6BYvqZy6QJrWyBQkCxWOXBoQxmyaA&sz=w2000',
      description: [
        'The Women’s Fellowship plays a vital role in our Andrew’s Church. The Women’s Fellowship meets regularly for prayer, fellowship, and Bible study. Specifically, they gather every Saturday 10.00a.m. These meetings provide a space for fellowship and prayer.',
        'The members of the Women’s Fellowship actively support the various ministries through their prayers and active involvement. Throughout the year, the Women’s Fellowship organizes get - together and retreats. These events allow women to share experiences, strengthen their bonds, and provide mutual support.',
      ],
      inCharge: 'Women’s Fellowship In-Charge –',
    },
    {
      name: 'Men’s Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=13WjWEcU9r4lUqUOkUCM5PdB3YJeOWO9h&sz=w2000',
      description: [
        'The men’s Fellowship plays a vital role in our Andrew’s Church. The men’s fellowship meets regularly for prayer, fellowship, and Bible study. Specifically, they gather every Sunday 10.45a.m. These meetings provide a space for fellowship and prayer. These allow to share experiences, strengthen their bonds, and provide mutual support.',
        'The Men’s Fellowship actively seeks new ways to witness to the Gospel of Jesus Christ and contribute to the Church ministries.',
      ],
      inCharge: 'Men’s Fellowship In-Charge –',
    },
    {
      name: 'Youth Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=19-nGOGCy0w8CfulyjEa7TmWiVXrZHka1&sz=w2000',
      description: [
        'The young people of St. Andrew’s infuse vibrant energy, creativity, and enthusiasm into our church community. The Youth Fellowship meets every Sunday for prayer, discussions, and fellowship on 10.45am.',
        'It’s a space where young minds come together to grow spiritually and connect.',
      ],
      inCharge: 'Youth Fellowship In-Charge –',
    },
    {
      name: 'Young Couples Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=1StYxiNBqh_WJjiqfwJRJq1eAi9Ji0GRU&sz=w2000',
      description: [
        'Fellowship meets every Sunday for prayer, discussions, and fellowship on 10.45am. Couples Fellowship, a time dedicated to strengthening bonds and fostering deeper connections with God and each other. It is a joyful occasion where couples come together to share their experiences, support one another, and grow in their faith. Through meaningful conversations, inspiring Bible teachings, and delightful activities, the fellowship aims to cultivate a sense of community and provide a nurturing environment for marriages to thrive.',
      ],
      inCharge: '',
    },
    {
      name: 'Friend’s Prayer Group',
      imageUrl: 'https://drive.google.com/thumbnail?id=1_xRaKuKSi57e2P5ojgjsUkBQe4YkSWO9&sz=w2000',
      description: [
        'The Friend’s Prayer Group’s mission is to nurture the spiritual development of the fellowship members. the group convenes for prayer every Wednesday 9:30 p.m. through G-Meet.',
      ],
      inCharge: '',
    },
  ];
}
