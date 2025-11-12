<template>
    <div class="h-screen flex items-center justify-center px-4">
        <Card class="max-w-md w-full space-y-2 p-8">
            <!-- Error Details -->
            <p v-if="error?.statusCode" class="text-4xl font-black">
                {{ error.statusCode }}
            </p>

            <!-- Error Description -->
            <p
                v-if="error?.message"
                class="text-xl text-slate-700 dark:text-slate-300 break-words"
            >
                {{ error.message }}
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3">
                <Button class="w-full" @click="navigateHome"> Домой </Button>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";

interface NuxtError {
    statusCode?: number;
    message?: string;
    stack?: string;
}

defineProps<{
    error: NuxtError;
}>();

const router = useRouter();

const navigateHome = () => {
    router.push("/");
    clearError();
};
</script>
