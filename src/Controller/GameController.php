<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\RoundLocation;

class GameController extends AbstractController
{
    #[Route('/random-location', name: 'api_random_location', methods: ['GET'])]
    public function getRandomLocation(EntityManagerInterface $entityManager): JsonResponse
    {

        // Récupère une entrée aléatoire de la base de données
        $repository = $entityManager->getRepository(RoundLocation::class);
        $locations = $repository->findAll();

        if (empty($locations)) {
            return new JsonResponse(['error' => 'No locations found'], 404);
        }

        $randomLocation = $locations[array_rand($locations)];


        // Retourne une réponse JSON
        return new JsonResponse([
            'imagePath' => $randomLocation->getImagePath(),
            'xCoordinate' => $randomLocation->getCoordinateX(),
            'yCoordinate' => $randomLocation->getCoordinateY(),
            'description' => $randomLocation->getDescription(),
            'difficulty' => $randomLocation->getDifficulty(),
        ]);
    }
}
