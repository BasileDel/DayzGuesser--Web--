<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontendController extends AbstractController
{
    #[Route('/{route}', name: 'frontend', requirements: ['route' => '.*'], priority: -1)]
    public function index(): Response
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/frontend/src/old/index.html';

        return new Response(
            file_get_contents($filePath),
            Response::HTTP_OK,
            ['Content-Type' => 'text/html']
        );
    }
}
