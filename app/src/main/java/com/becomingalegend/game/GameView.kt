package com.becomingalegend.game

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.SurfaceView

/**
 * Core game view — provides a game loop with update/render cycle.
 *
 * This is the heart of the game. Override [update] and [render] to build
 * your game logic and drawing.
 *
 * The game loop runs at a target of 60 FPS using a fixed time-step approach.
 */
class GameView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : SurfaceView(context, attrs), SurfaceHolder.Callback, Runnable {

    companion object {
        /** Target frames per second */
        const val TARGET_FPS = 60

        /** Time per frame in milliseconds */
        const val FRAME_PERIOD = 1000L / TARGET_FPS
    }

    // ── Game Loop ──
    private var gameThread: Thread? = null

    @Volatile
    private var isRunning = false
    private var isPaused = true

    // ── Rendering ──
    private val paint = Paint().apply {
        isAntiAlias = true
        color = Color.WHITE
        textSize = 64f
        textAlign = Paint.Align.CENTER
    }

    // ── Game State ──
    private var screenWidth = 0
    private var screenHeight = 0
    private var fps: Long = 0

    init {
        holder.addCallback(this)
        isFocusable = true
    }

    // ══════════════════════════════════════════════════
    //  SurfaceHolder.Callback
    // ══════════════════════════════════════════════════

    override fun surfaceCreated(holder: SurfaceHolder) {
        screenWidth = width
        screenHeight = height
        initGame()
        resume()
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
        screenWidth = width
        screenHeight = height
    }

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        pause()
    }

    // ══════════════════════════════════════════════════
    //  Game Loop
    // ══════════════════════════════════════════════════

    override fun run() {
        var lastTime = System.currentTimeMillis()

        while (isRunning) {
            if (!isPaused && holder.surface.isValid) {
                val now = System.currentTimeMillis()
                val deltaTime = (now - lastTime) / 1000f  // seconds
                lastTime = now

                // Update game state
                update(deltaTime)

                // Render frame
                val canvas: Canvas? = holder.lockCanvas()
                if (canvas != null) {
                    try {
                        render(canvas)
                    } finally {
                        holder.unlockCanvasAndPost(canvas)
                    }
                }

                // Frame rate control
                val frameTime = System.currentTimeMillis() - now
                if (frameTime < FRAME_PERIOD) {
                    try {
                        Thread.sleep(FRAME_PERIOD - frameTime)
                    } catch (_: InterruptedException) {
                        // Ignore
                    }
                }

                fps = 1000L / maxOf(System.currentTimeMillis() - now, 1)
            } else {
                // If paused, sleep to avoid burning CPU
                try {
                    Thread.sleep(100)
                } catch (_: InterruptedException) {
                    // Ignore
                }
            }
        }
    }

    // ══════════════════════════════════════════════════
    //  Game Logic — OVERRIDE THESE
    // ══════════════════════════════════════════════════

    /**
     * Called once when the surface is first created.
     * Initialize your game objects, load resources, etc.
     */
    private fun initGame() {
        // TODO: Initialize your game objects here
    }

    /**
     * Update game state.
     * @param deltaTime Time elapsed since last frame, in seconds.
     */
    private fun update(deltaTime: Float) {
        // TODO: Update game logic here
        // Example: move objects, check collisions, update animations
    }

    /**
     * Render the current game state to the canvas.
     * @param canvas The canvas to draw on.
     */
    private fun render(canvas: Canvas) {
        // Clear screen
        canvas.drawColor(Color.parseColor("#1a1a2e"))

        // TODO: Draw your game objects here

        // Draw placeholder text
        paint.color = Color.WHITE
        paint.textSize = 72f
        canvas.drawText(
            "Becoming A Legend",
            screenWidth / 2f,
            screenHeight / 2f - 50f,
            paint
        )

        paint.textSize = 36f
        paint.color = Color.parseColor("#aaaaaa")
        canvas.drawText(
            "Tap to start",
            screenWidth / 2f,
            screenHeight / 2f + 50f,
            paint
        )

        // Draw FPS counter (debug)
        paint.textSize = 28f
        paint.textAlign = Paint.Align.LEFT
        paint.color = Color.GREEN
        canvas.drawText("FPS: $fps", 20f, 40f, paint)
        paint.textAlign = Paint.Align.CENTER
    }

    // ══════════════════════════════════════════════════
    //  Touch Input
    // ══════════════════════════════════════════════════

    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                // TODO: Handle touch down
            }
            MotionEvent.ACTION_MOVE -> {
                // TODO: Handle touch move
            }
            MotionEvent.ACTION_UP -> {
                // TODO: Handle touch up
            }
        }
        return true
    }

    // ══════════════════════════════════════════════════
    //  Lifecycle
    // ══════════════════════════════════════════════════

    fun resume() {
        isPaused = false
        if (!isRunning) {
            isRunning = true
            gameThread = Thread(this, "GameThread").also { it.start() }
        }
    }

    fun pause() {
        isPaused = true
        isRunning = false
        try {
            gameThread?.join(500)
        } catch (_: InterruptedException) {
            // Ignore
        }
        gameThread = null
    }
}

