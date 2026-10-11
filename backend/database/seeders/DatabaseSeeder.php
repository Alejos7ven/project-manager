<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Demo Admin User
        $user = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Demo Admin',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Realistic Clients Data (10 clients)
        $clientsData = [
            [
                'name' => 'Acme Corporation',
                'email' => 'contact@acmecorp.com',
                'phone' => '+1 (555) 123-4567',
                'company' => 'Acme Global Holdings',
                'status' => 'active',
            ],
            [
                'name' => 'Nexus Innovations',
                'email' => 'hello@nexusinnovations.io',
                'phone' => '+1 (555) 234-5678',
                'company' => 'Nexus Tech Group',
                'status' => 'active',
            ],
            [
                'name' => 'BluePeak Media',
                'email' => 'projects@bluepeakmedia.com',
                'phone' => '+1 (555) 345-6789',
                'company' => 'BluePeak Agency',
                'status' => 'active',
            ],
            [
                'name' => 'Quantum Health',
                'email' => 'info@quantumhealth.org',
                'phone' => '+1 (555) 456-7890',
                'company' => 'Quantum Care Systems',
                'status' => 'active',
            ],
            [
                'name' => 'Summit Logistics',
                'email' => 'ops@summitlogistics.net',
                'phone' => '+1 (555) 567-8901',
                'company' => 'Summit Freight & Supply',
                'status' => 'active',
            ],
            [
                'name' => 'Vortex Studio',
                'email' => 'design@vortexstudio.co',
                'phone' => '+1 (555) 678-9012',
                'company' => 'Vortex Creative Lab',
                'status' => 'lead',
            ],
            [
                'name' => 'Apex Retailers',
                'email' => 'support@apexretailers.com',
                'phone' => '+1 (555) 789-0123',
                'company' => 'Apex Commerce Corp',
                'status' => 'lead',
            ],
            [
                'name' => 'Solaris Energy',
                'email' => 'contact@solarisenergy.green',
                'phone' => '+1 (555) 890-1234',
                'company' => 'Solaris Renewable Inc',
                'status' => 'lead',
            ],
            [
                'name' => 'Heritage Finance',
                'email' => 'team@heritagefinance.com',
                'phone' => '+1 (555) 901-2345',
                'company' => 'Heritage Capital Advisors',
                'status' => 'inactive',
            ],
            [
                'name' => 'Zenith Hospitality',
                'email' => 'frontdesk@zenithhospitality.com',
                'phone' => '+1 (555) 012-3456',
                'company' => 'Zenith Resorts & Hotels',
                'status' => 'inactive',
            ],
        ];

        $clients = [];
        foreach ($clientsData as $clientData) {
            $clients[] = Client::updateOrCreate(
                ['email' => $clientData['email']],
                $clientData
            );
        }

        // 3. Realistic Projects Data (18 projects)
        $projectsData = [
            [
                'client_index' => 0,
                'name' => 'Enterprise E-Commerce Replatforming',
                'description' => 'Migrate legacy web storefront to a modern headless architecture with integrated ERP synchronization.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(30)->toDateString(),
                'deadline' => Carbon::now()->addDays(60)->toDateString(),
            ],
            [
                'client_index' => 0,
                'name' => 'Global Logistics Tracking Portal',
                'description' => 'Real-time telemetry and shipment milestone visibility portal for international freight customers.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(5)->toDateString(),
                'deadline' => Carbon::now()->addDays(90)->toDateString(),
            ],
            [
                'client_index' => 1,
                'name' => 'AI Customer Insights Engine',
                'description' => 'Machine-learning dashboard analyzing multi-channel customer sentiment and support ticket velocity.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(15)->toDateString(),
                'deadline' => Carbon::now()->addDays(45)->toDateString(),
            ],
            [
                'client_index' => 1,
                'name' => 'Microservices Architecture Audit',
                'description' => 'Comprehensive security, scalability, and latency benchmarking of backend infrastructure.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(90)->toDateString(),
                'deadline' => Carbon::now()->subDays(10)->toDateString(),
            ],
            [
                'client_index' => 2,
                'name' => 'Omnichannel Marketing Hub',
                'description' => 'Unified campaign scheduling and analytics suite connecting social channels, newsletters, and ad spend.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(40)->toDateString(),
                'deadline' => Carbon::now()->addDays(20)->toDateString(),
            ],
            [
                'client_index' => 2,
                'name' => 'Brand Identity & Design System',
                'description' => 'Complete tokenized Figma design system and component library for cross-platform apps.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(75)->toDateString(),
                'deadline' => Carbon::now()->subDays(5)->toDateString(),
            ],
            [
                'client_index' => 3,
                'name' => 'Telehealth Consultation Platform',
                'description' => 'HIPAA-compliant video appointments, electronic prescription dispatch, and digital medical charts.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(60)->toDateString(),
                'deadline' => Carbon::now()->addDays(30)->toDateString(),
            ],
            [
                'client_index' => 3,
                'name' => 'Patient Mobile App v2',
                'description' => 'Native iOS & Android patient companion app with appointment reminders and vital stats tracking.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(10)->toDateString(),
                'deadline' => Carbon::now()->addDays(120)->toDateString(),
            ],
            [
                'client_index' => 4,
                'name' => 'Fleet Telematics & Route Optimization',
                'description' => 'Automated dynamic route planning reducing fuel overhead and improving driver turnaround time.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(25)->toDateString(),
                'deadline' => Carbon::now()->addDays(50)->toDateString(),
            ],
            [
                'client_index' => 4,
                'name' => 'Automated Dispatch System',
                'description' => 'Event-driven job dispatching system with SMS notification fallback for field operators.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(120)->toDateString(),
                'deadline' => Carbon::now()->subDays(20)->toDateString(),
            ],
            [
                'client_index' => 5,
                'name' => 'Interactive 3D Portfolio Experience',
                'description' => 'WebGL-powered showcase site highlighting agency showreels and interactive campaigns.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(7)->toDateString(),
                'deadline' => Carbon::now()->addDays(70)->toDateString(),
            ],
            [
                'client_index' => 5,
                'name' => 'Creative Asset Management Pipeline',
                'description' => 'High-throughput cloud rendering and asset review workflow for video production.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(14)->toDateString(),
                'deadline' => Carbon::now()->addDays(80)->toDateString(),
            ],
            [
                'client_index' => 6,
                'name' => 'Next-Gen Point of Sale (POS)',
                'description' => 'Cloud-synchronized in-store checkout terminal with offline transaction queueing.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(3)->toDateString(),
                'deadline' => Carbon::now()->addDays(100)->toDateString(),
            ],
            [
                'client_index' => 6,
                'name' => 'Customer Loyalty & Rewards App',
                'description' => 'Tiered rewards and digital punch card integration for recurring storefront visits.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(20)->toDateString(),
                'deadline' => Carbon::now()->addDays(110)->toDateString(),
            ],
            [
                'client_index' => 7,
                'name' => 'Smart Grid Monitoring Dashboard',
                'description' => 'IoT sensor aggregation panel measuring solar array output, battery storage, and consumption.',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(10)->toDateString(),
                'deadline' => Carbon::now()->addDays(75)->toDateString(),
            ],
            [
                'client_index' => 7,
                'name' => 'Consumer Energy Savings Portal',
                'description' => 'Self-service dashboard helping homeowners optimize their solar panel usage and tax credits.',
                'status' => 'pending',
                'start_date' => Carbon::now()->addDays(15)->toDateString(),
                'deadline' => Carbon::now()->addDays(90)->toDateString(),
            ],
            [
                'client_index' => 8,
                'name' => 'Wealth Management Client Portal',
                'description' => 'Secure investor reporting portal with portfolio breakdown and automated tax statement downloads.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(180)->toDateString(),
                'deadline' => Carbon::now()->subDays(40)->toDateString(),
            ],
            [
                'client_index' => 9,
                'name' => 'Hotel Booking & Concierge Engine',
                'description' => 'Direct reservation workflow with room selection, add-on spa bookings, and automated check-in.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subDays(150)->toDateString(),
                'deadline' => Carbon::now()->subDays(30)->toDateString(),
            ],
        ];

        foreach ($projectsData as $item) {
            $clientId = $clients[$item['client_index']]->id;
            Project::updateOrCreate(
                [
                    'client_id' => $clientId,
                    'name' => $item['name'],
                ],
                [
                    'description' => $item['description'],
                    'status' => $item['status'],
                    'start_date' => $item['start_date'],
                    'deadline' => $item['deadline'],
                ]
            );
        }
    }
}
