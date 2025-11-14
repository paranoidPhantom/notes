<template>
    <div class="max-w-[1000px] w-full mx-auto">
        <header
            class="flex md:hidden mx-8 my-4 ml-auto mb-0 p-4 ring ring-accent rounded-xl w-fit"
        >
            <SidebarTrigger />
        </header>
        <main class="p-8">
            <slot />
        </main>
    </div>
</template>
