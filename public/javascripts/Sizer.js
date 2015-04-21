/**
 * Calculator for sizing periods.
 * @param planStart   The time at which the plan starts (the earliest possible time)
 */

CriticalSight.Sizer = function(planStart, unitWidth, unitHeight) {
    'use strict';
    
    this.topPadding = unitHeight * 0.5;
    this.unitHeight = unitHeight;
    this.midPadding = unitHeight * 0.5;
    this.unitWidth = unitWidth;

    /**
     * Top of a task rectangle, where the task is index `idx`.
     */
    this.top = function(idx) {
        return (this.unitHeight + this.midPadding) * idx + this.topPadding;
    };

    /**
     * Left of a task rectangle, where the start is at time `start`.
     */
    this.left = function(start) {
        return (start - planStart) * this.unitWidth;
    };

    /**
     * Width of a task rectangle, where the task's duration is `dur`.
     */
    this.width = function(dur) {
        return dur * this.unitWidth;
    };
};
