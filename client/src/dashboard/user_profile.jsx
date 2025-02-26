import React, {useEffect, useState} from 'react';
import '../base.css';

function UserProfile() {
    //{/*<!-- User Profile Section -->*/}
    return(
        <div class="p-6 border-t border-neutral-200/30">
            <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                    <svg class="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div class="ml-3">
                    <div class="text-sm font-medium text-neutral-700">Admin User</div>
                    <div class="text-xs text-neutral-500">admin@docuai.com</div>
                </div>
            </div>
        </div>
    )
};

export default UserProfile