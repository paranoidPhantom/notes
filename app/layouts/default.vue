<template>
    <div class="max-w-[1000px] w-full mx-auto">
        <header
            class="right-4 top-4 z-10 backdrop-blur-xl flex fixed md:hidden mx-8 my-4 mb-0 p-4 ring ring-accent rounded-xl w-fit"
        >
            <SidebarTrigger />
        </header>
        <main class="p-8">
            <slot />
        </main>
    </div>
</template>
