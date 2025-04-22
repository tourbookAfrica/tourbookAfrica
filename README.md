# TourbookAfrica

TourbookAfrica is a comprehensive travel platform for exploring and booking tours, car rentals, flights, and hotels across Africa. The application provides a modern, user-friendly interface for travelers to discover and book various travel experiences.

## Features

- **Tour Booking**: Browse and book tours across Africa with detailed itineraries, pricing, and availability.
- **Car Rentals**: Search and rent vehicles for your African adventure with flexible pickup and drop-off options.
- **Flight Booking**: Find and book flights to and within Africa with competitive pricing.
- **Hotel Reservations**: Discover and book accommodations ranging from luxury hotels to cozy lodges.
- **User Profiles**: Manage your bookings, reviews, and personal information.
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices.

## Technology Stack

- **Frontend**: Angular 19, TypeScript, SCSS
- **UI Libraries**: Angular Material, Bootstrap, Font Awesome
- **State Management**: RxJS
- **Routing**: Angular Router
- **HTTP Client**: Angular HttpClient
- **Animations**: Angular Animations

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## Project Structure

```
tourbookAfrica/
├── src/
│   ├── app/
│   │   ├── components/         # Shared components
│   │   ├── models/             # TypeScript interfaces and types
│   │   ├── services/           # Angular services
│   │   ├── shared/             # Shared modules, components, directives, pipes
│   │   ├── tours/              # Tour-related components and modules
│   │   ├── app.component.ts    # Root component
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.routes.ts       # Application routes
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── environments/           # Environment configurations
│   ├── index.html              # Main HTML file
│   └── main.ts                 # Application entry point
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
