"use server";

import { db } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUser = async(userId: string, data: any) => {
    await db.user.update({
        where: {id: userId},
        data :{...data},
    });

    revalidatePath("/");
}