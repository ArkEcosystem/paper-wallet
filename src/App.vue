<template>
    <div id="app" class="flex flex-col items-center" >
        <div id="content">
            <!-- <div id="nav">
                <router-link to="/wallet-from-entropy">Create a new wallet</router-link>
                <router-link to="/wallet-from-passphrase">Enter a secret passphrase</router-link>
            </div> -->

            <router-view />

            <div class="flex flex-col text-gray-500 text-center mt-10">
                <span>Hosted by GitHub Pages. Source code is available <a class="inline-link" href="" target="_blank">here</a>. You can download and run locally <a class="inline-link" href="" target="_blank">here</a></span>
                <span class="text-sm">Made with ❤️<a class="inline-link" href="" target="_blank">ARK.io</a></span>
            </div>
        </div>
    </div>
</template>

<style lang="stylus">
#content {
    background-image: url('assets/img/background.png')
}
</style>
