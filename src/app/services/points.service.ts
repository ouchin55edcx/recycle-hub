import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../models/demand.model';

interface PointsConversion {
  id?: number;
  userId: number;
  points: number;
  conversionDate: string;
  couponValue: number;
}

@Injectable({ providedIn: 'root' })
export class PointsService {
  private readonly pointsRate = {
    plastic: 2,
    glass: 1,
    paper: 1,
    metal: 5
  };

  constructor(private http: HttpClient) {}

  calculatePoints(demands: Demand[]): number {
    return demands
      .filter(d => d.status === 'validée' && d.realWeight)
      .reduce((total, demand) => {
        return total + demand.types.reduce((sum, type) => {
          return sum + (this.pointsRate[type] * (demand.realWeight || 0));
        }, 0);
      }, 0);
  }

  getPointsHistory(userId: number): Observable<PointsConversion[]> {
    return this.http.get<PointsConversion[]>(`/points?userId=${userId}`);
  }

  convertPoints(userId: number, points: number): Observable<PointsConversion> {
    const conversion = this.calculateConversion(points);
    return this.http.post<PointsConversion>('/points', {
      userId,
      points: conversion.points,
      couponValue: conversion.value,
      conversionDate: new Date().toISOString()
    });
  }

  private calculateConversion(points: number): { points: number; value: number } {
    if (points >= 500) return { points: 500, value: 350 };
    if (points >= 200) return { points: 200, value: 120 };
    if (points >= 100) return { points: 100, value: 50 };
    throw new Error('Not enough points for conversion');
  }
}   