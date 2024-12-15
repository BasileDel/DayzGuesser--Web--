<?php

namespace App\DataFixtures;

use App\Entity\RoundLocation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RoundLocationFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $locations = [
            ['path' => 'images/image1.jpg', 'x' => 1000, 'y' => 2000, 'description' => 'Near the river', 'difficulty' => 1],
            ['path' => 'images/image2.jpg', 'x' => 3000, 'y' => 4000, 'description' => 'Inside the forest', 'difficulty' => 2],
            ['path' => 'images/image3.jpg', 'x' => 5000, 'y' => 6000, 'description' => 'On the road', 'difficulty' => 3],
            ['path' => 'images/image4.jpg', 'x' => 7000, 'y' => 8000, 'description' => 'In the city', 'difficulty' => 4],
            ['path' => 'images/image5.jpg', 'x' => 9000, 'y' => 10000, 'description' => 'On the hill', 'difficulty' => 5],
            // Ajoutez d'autres emplacements
        ];

        foreach ($locations as $data) {
            $location = new RoundLocation();
            $location->setImagePath($data['path']);
            $location->setCoordinateX($data['x']);
            $location->setCoordinateY($data['y']);
            $location->setDescription($data['description']);
            $location->setDifficulty($data['difficulty']);
            $manager->persist($location);
        }

        $manager->flush();
    }
}
