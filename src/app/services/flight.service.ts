import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: number;
  name: string;
  code: string;
  logo: string;
}

export interface StopDetail {
  airport: string;
  duration: string;
}

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  stops: number;
  duration: string;
  class: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  class: string;
  stops?: number[];
  airlines?: string[];
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private airports: Airport[] = [
    {
      "code": "JFK",
      "name": "John F. Kennedy International Airport",
      "city": "New York",
      "country": "United States"
    },
    {
      "code": "LHR",
      "name": "Heathrow Airport",
      "city": "London",
      "country": "United Kingdom"
    },
    {
      "code": "CDG",
      "name": "Charles de Gaulle Airport",
      "city": "Paris",
      "country": "France"
    },
    {
      "code": "AMS",
      "name": "Amsterdam Airport Schiphol",
      "city": "Amsterdam",
      "country": "Netherlands"
    },
    {
      "code": "FRA",
      "name": "Frankfurt Airport",
      "city": "Frankfurt",
      "country": "Germany"
    },
    {
      "code": "DXB",
      "name": "Dubai International Airport",
      "city": "Dubai",
      "country": "United Arab Emirates"
    },
    {
      "code": "NBO",
      "name": "Jomo Kenyatta International Airport",
      "city": "Nairobi",
      "country": "Kenya"
    },
    {
      "code": "JRO",
      "name": "Kilimanjaro International Airport",
      "city": "Kilimanjaro",
      "country": "Tanzania"
    },
    {
      "code": "CPT",
      "name": "Cape Town International Airport",
      "city": "Cape Town",
      "country": "South Africa"
    },
    {
      "code": "JNB",
      "name": "O.R. Tambo International Airport",
      "city": "Johannesburg",
      "country": "South Africa"
    },
    {
      "code": "DAR",
      "name": "Julius Nyerere International Airport",
      "city": "Dar es Salaam",
      "country": "Tanzania"
    },
    {
      "code": "ZNZ",
      "name": "Abeid Amani Karume International Airport",
      "city": "Zanzibar",
      "country": "Tanzania"
    },
    {
      "code": "MUB",
      "name": "Maun Airport",
      "city": "Maun",
      "country": "Botswana"
    },
    {
      "code": "VFA",
      "name": "Victoria Falls Airport",
      "city": "Victoria Falls",
      "country": "Zimbabwe"
    },
    {
      "code": "WDH",
      "name": "Hosea Kutako International Airport",
      "city": "Windhoek",
      "country": "Namibia"
    }
  ];

  private airlines: Airline[] = [
    {
      id: 1,
      name: 'Kenya Airways',
      code: 'KQ',
      logo: 'assets/images/airlines/kenya-airways.png'
    },
    {
      id: 2,
      name: 'Ethiopian Airlines',
      code: 'ET',
      logo: 'assets/images/airlines/ethiopian-airlines.png'
    },
    {
      id: 3,
      name: 'South African Airways',
      code: 'SA',
      logo: 'assets/images/airlines/sa.png'
    },
    {
      id: 4,
      name: 'EgyptAir',
      code: 'MS',
      logo: 'assets/images/airlines/ms.png'
    },
    {
      id: 5,
      name: 'Royal Air Maroc',
      code: 'AT',
      logo: 'assets/images/airlines/at.png'
    }
  ];

  private flights: Flight[] = [
    {
      id: 1,
      airline: 'Kenya Airways',
      flightNumber: 'KQ123',
      origin: 'Nairobi',
      destination: 'Mombasa',
      departureTime: '2024-03-20T08:00:00',
      arrivalTime: '2024-03-20T09:30:00',
      price: 150,
      stops: 0,
      duration: '1h 30m',
      class: 'economy'
    },
    {
      id: 2,
      airline: 'Ethiopian Airlines',
      flightNumber: 'ET456',
      origin: 'Addis Ababa',
      destination: 'Nairobi',
      departureTime: '2024-03-20T10:00:00',
      arrivalTime: '2024-03-20T11:30:00',
      price: 200,
      stops: 0,
      duration: '1h 30m',
      class: 'business'
    }
  ];

  constructor(private http: HttpClient) { }

  getAllAirports(): Observable<Airport[]> {
    // In a real application, this would be an HTTP call
    return of(this.airports);
  }

  searchAirports(query: string): Observable<Airport[]> {
    if (!query) {
      return of([]);
    }
    
    const lowercaseQuery = query.toLowerCase();
    return of(this.airports.filter(airport => 
      airport.code.toLowerCase().includes(lowercaseQuery) ||
      airport.name.toLowerCase().includes(lowercaseQuery) ||
      airport.city.toLowerCase().includes(lowercaseQuery) ||
      airport.country.toLowerCase().includes(lowercaseQuery)
    ));
  }

  getAirportByCode(code: string): Observable<Airport | undefined> {
    return of(this.airports.find(airport => airport.code === code));
  }

  getAvailableAirlines(): Observable<Airline[]> {
    return of(this.airlines).pipe(delay(500));
  }

  searchFlights(params: FlightSearchParams): Observable<Flight[]> {
    // Simulate API call with delay
    return of(this.flights).pipe(delay(1000));
  }

  getFlightById(id: number): Observable<Flight | undefined> {
    const flight = this.flights.find(f => f.id === id);
    return of(flight).pipe(delay(500));
  }

  // Helper method to calculate flight duration
  calculateFlightDuration(departureDate: string, departureTime: string, arrivalDate: string, arrivalTime: string): string {
    const departure = new Date(`${departureDate}T${departureTime}`);
    const arrival = new Date(`${arrivalDate}T${arrivalTime}`);
    
    // Handle overnight flights
    if (arrival < departure) {
      arrival.setDate(arrival.getDate() + 1);
    }
    
    const diffMs = arrival.getTime() - departure.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  }

  // Helper method to get popular destinations
  getPopularDestinations(): Observable<Airport[]> {
    // Return a subset of airports that are popular destinations
    return of(this.airports.filter(airport => 
      ['NBO', 'JRO', 'CPT', 'JNB', 'DAR', 'ZNZ', 'MUB', 'VFA', 'WDH'].includes(airport.code)
    ));
  }

  // Helper method to get popular origins
  getPopularOrigins(): Observable<Airport[]> {
    // Return a subset of airports that are popular origins
    return of(this.airports.filter(airport => 
      ['LHR', 'JFK', 'CDG', 'AMS', 'FRA', 'DXB'].includes(airport.code)
    ));
  }

  getAirlines(): Observable<Airline[]> {
    return of(this.airlines).pipe(delay(500));
  }
} 