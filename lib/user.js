// lib/user.js
import prisma from './prisma';

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function createUser(userData) {
  return await prisma.user.create({
    data: {
      ...userData,
      role: 'pending'  // Set role to 'pending' by default
    }
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}