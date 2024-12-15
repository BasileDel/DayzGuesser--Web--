<?php

namespace App\Entity;

use App\Repository\RoundLocationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RoundLocationRepository::class)]
class RoundLocation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $coordinate_X = null;

    #[ORM\Column(nullable: true)]
    private ?int $coordinate_Y = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagePath = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?int $difficulty = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getCoordinateX(): ?int
    {
        return $this->coordinate_X;
    }

    public function setCoordinateX(?int $coordinate_X): static
    {
        $this->coordinate_X = $coordinate_X;

        return $this;
    }

    public function getCoordinateY(): ?int
    {
        return $this->coordinate_Y;
    }

    public function setCoordinateY(?int $coordinate_Y): static
    {
        $this->coordinate_Y = $coordinate_Y;

        return $this;
    }

    public function getImagePath(): ?string
    {
        return $this->imagePath;
    }

    public function setImagePath(?string $imagePath): static
    {
        $this->imagePath = $imagePath;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDifficulty(): ?int
    {
        return $this->difficulty;
    }

    public function setDifficulty(?int $difficulty): static
    {
        $this->difficulty = $difficulty;

        return $this;
    }
}
