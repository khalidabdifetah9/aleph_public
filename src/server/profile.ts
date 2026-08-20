"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface ProfileInput {
  userId: string;
  name: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  timezone?: string;
  languages?: string;
  yearsExperience?: number | null;
  availability?: string;
  linkedinUrl?: string;
  profileImage?: string;
  skills?: string;
  portfolioUrl?: string;
  hourlyRate?: number | null;
  company?: string;
  companyWebsite?: string;
  industry?: string;
}

export async function updateProfile(input: ProfileInput) {
  if (!input.userId) return { error: "User ID is required" };

  const name = input.name?.trim();
  if (!name) return { error: "Name is required" };

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      name,
      headline: input.headline?.trim() || null,
      bio: input.bio?.trim() || null,
      location: input.location?.trim() || null,
      phone: input.phone?.trim() || null,
      timezone: input.timezone?.trim() || null,
      languages: input.languages?.trim() || null,
      yearsExperience:
        input.yearsExperience && input.yearsExperience >= 0
          ? input.yearsExperience
          : null,
      availability: input.availability?.trim() || null,
      linkedinUrl: input.linkedinUrl?.trim() || null,
      profileImage: input.profileImage?.trim() || null,
      skills: input.skills?.trim() || null,
      portfolioUrl: input.portfolioUrl?.trim() || null,
      hourlyRate:
        input.hourlyRate && input.hourlyRate > 0 ? input.hourlyRate : null,
      company: input.company?.trim() || null,
      companyWebsite: input.companyWebsite?.trim() || null,
      industry: input.industry?.trim() || null,
      onboarded: true,
      verificationStatus: "PENDING",
      rejectionReason: null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/verify");
  return { success: true };
}