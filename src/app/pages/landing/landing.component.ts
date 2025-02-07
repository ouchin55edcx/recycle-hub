import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface RecyclableItem {
  name: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavbarComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  features: Feature[] = [
    {
      icon: '♻️',
      title: 'Easy Recycling',
      description: 'Schedule pickups with just a few taps and track your progress effortlessly'
    },
    {
      icon: '🌍',
      title: 'Environmental Impact',
      description: 'Measure your personal contribution to sustainability with real-time analytics'
    },
    {
      icon: '🏆',
      title: 'Reward System',
      description: 'Earn eco-points and unlock exclusive rewards for your recycling efforts'
    }
  ];

  recyclableItems: RecyclableItem[] = [
    { 
      name: 'Plastic', 
      icon: '🚯',
      description: 'Bottles, containers, packaging'
    },
    { 
      name: 'Paper', 
      icon: '📄',
      description: 'Newspapers, cardboard, magazines'
    },
    { 
      name: 'Glass', 
      icon: '🍾',
      description: 'Bottles, jars, windowpanes'
    },
    { 
      name: 'Metal', 
      icon: '🥫',
      description: 'Cans, foil, scrap metal'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}