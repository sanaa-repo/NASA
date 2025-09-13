// LeetCode Questions Database
const leetcodeQuestions = {
  easy: [
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      difficulty: "easy",
      starterCode: `def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target, 
    return indices of the two numbers such that they add up to target.
    
    Args:
        nums: List of integers
        target: Integer target sum
        
    Returns:
        List of two indices
    """
    # Your code here
    return []`,
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
        { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
      ],
      hint: "Use a hash map to store numbers and their indices as you iterate through the array.",
      explanation: "The optimal solution uses a hash map to store each number and its index. For each number, check if target - number exists in the map."
    },
    {
      id: 2,
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.",
      difficulty: "easy",
      starterCode: `def is_valid(s):
    """
    Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
    determine if the input string is valid.
    
    Args:
        s: String containing parentheses, brackets, and braces
        
    Returns:
        Boolean indicating if the string is valid
    """
    # Your code here
    return False`,
      testCases: [
        { input: { s: "()" }, expected: true },
        { input: { s: "()[]{}" }, expected: true },
        { input: { s: "(]" }, expected: false },
        { input: { s: "([)]" }, expected: false }
      ],
      hint: "Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the most recent opening bracket.",
      explanation: "Use a stack data structure. Push opening brackets onto the stack, and when encountering closing brackets, pop from stack and check for matches."
    },
    {
      id: 3,
      title: "Maximum Subarray",
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      difficulty: "easy",
      starterCode: `def max_sub_array(nums):
    """
    Given an integer array nums, find the contiguous subarray 
    (containing at least one number) which has the largest sum.
    
    Args:
        nums: List of integers
        
    Returns:
        Integer representing the maximum sum
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
        { input: { nums: [1] }, expected: 1 },
        { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 }
      ],
      hint: "Use Kadane's algorithm. Keep track of the maximum sum ending at each position.",
      explanation: "Kadane's algorithm: for each element, decide whether to start a new subarray or extend the existing one."
    },
    {
      id: 4,
      title: "Climbing Stairs",
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      difficulty: "easy",
      starterCode: `def climb_stairs(n):
    """
    You are climbing a staircase. It takes n steps to reach the top.
    Each time you can either climb 1 or 2 steps.
    In how many distinct ways can you climb to the top?
    
    Args:
        n: Number of steps to reach the top
        
    Returns:
        Integer representing the number of distinct ways
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { n: 2 }, expected: 2 },
        { input: { n: 3 }, expected: 3 },
        { input: { n: 4 }, expected: 5 }
      ],
      hint: "This is a Fibonacci sequence problem. The number of ways to reach step n is the sum of ways to reach step n-1 and n-2.",
      explanation: "This follows the Fibonacci pattern: f(n) = f(n-1) + f(n-2), where f(1) = 1 and f(2) = 2."
    },
    {
      id: 5,
      title: "Best Time to Buy and Sell Stock",
      description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
      difficulty: "easy",
      starterCode: `def max_profit(prices):
    """
    Find the maximum profit from buying and selling stock.
    
    Args:
        prices: List of stock prices
        
    Returns:
        Maximum profit achievable
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
        { input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
        { input: { prices: [1, 2] }, expected: 1 }
      ],
      hint: "Keep track of the minimum price seen so far and calculate profit for each day.",
      explanation: "Use a single pass to find the minimum price and maximum profit."
    },
    {
      id: 6,
      title: "Single Number",
      description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
      difficulty: "easy",
      starterCode: `def single_number(nums):
    """
    Find the single number that appears only once.
    
    Args:
        nums: List of integers where every element appears twice except one
        
    Returns:
        The single number
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { nums: [2, 2, 1] }, expected: 1 },
        { input: { nums: [4, 1, 2, 1, 2] }, expected: 4 },
        { input: { nums: [1] }, expected: 1 }
      ],
      hint: "Use XOR operation - it has the property that a ^ a = 0 and a ^ 0 = a.",
      explanation: "XOR all numbers together. Numbers appearing twice will cancel out, leaving only the single number."
    },
    {
      id: 7,
      title: "Missing Number",
      description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
      difficulty: "easy",
      starterCode: `def missing_number(nums):
    """
    Find the missing number in the range [0, n].
    
    Args:
        nums: List of n distinct numbers
        
    Returns:
        The missing number
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { nums: [3, 0, 1] }, expected: 2 },
        { input: { nums: [0, 1] }, expected: 2 },
        { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expected: 8 }
      ],
      hint: "Use the formula for sum of first n natural numbers: n*(n+1)/2.",
      explanation: "Calculate expected sum and subtract actual sum to find the missing number."
    },
    {
      id: 8,
      title: "Move Zeroes",
      description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
      difficulty: "easy",
      starterCode: `def move_zeroes(nums):
    """
    Move all zeros to the end while maintaining relative order.
    
    Args:
        nums: List of integers (modified in-place)
    """
    # Your code here
    pass`,
      testCases: [
        { input: { nums: [0, 1, 0, 3, 12] }, expected: [1, 3, 12, 0, 0] },
        { input: { nums: [0] }, expected: [0] },
        { input: { nums: [1, 0, 1] }, expected: [1, 1, 0] }
      ],
      hint: "Use two pointers - one for the current position and one for the next non-zero position.",
      explanation: "Iterate through the array and swap non-zero elements to the front."
    }
  ],
  medium: [
    {
      id: 5,
      title: "Longest Palindromic Substring",
      description: "Given a string s, return the longest palindromic substring in s.",
      difficulty: "medium",
      starterCode: `def longest_palindrome(s):
    """
    Given a string s, return the longest palindromic substring in s.
    
    Args:
        s: Input string
        
    Returns:
        String representing the longest palindromic substring
    """
    # Your code here
    return ""`,
      testCases: [
        { input: { s: "babad" }, expected: "bab" },
        { input: { s: "cbbd" }, expected: "bb" },
        { input: { s: "a" }, expected: "a" }
      ],
      hint: "Use expand around centers approach. For each possible center, expand outward to find the longest palindrome.",
      explanation: "Check every possible center (including between characters) and expand outward while characters match."
    },
    {
      id: 6,
      title: "3Sum",
      description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
      difficulty: "medium",
      starterCode: `def three_sum(nums):
    """
    Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] 
    such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
    The solution set must not contain duplicate triplets.
    
    Args:
        nums: List of integers
        
    Returns:
        List of lists containing valid triplets
    """
    # Your code here
    return []`,
      testCases: [
        { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
        { input: { nums: [0, 1, 1] }, expected: [] },
        { input: { nums: [0, 0, 0] }, expected: [[0, 0, 0]] }
      ],
      hint: "Sort the array first, then use two pointers for each fixed element.",
      explanation: "Sort the array, then for each element, use two pointers to find pairs that sum to the negative of that element."
    },
    {
      id: 7,
      title: "Container With Most Water",
      description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
      difficulty: "medium",
      starterCode: `def max_area(height):
    """
    You are given an integer array height of length n. There are n vertical lines 
    drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
    Find two lines that together with the x-axis form a container, 
    such that the container contains the most water.
    
    Args:
        height: List of integers representing heights
        
    Returns:
        Integer representing the maximum area
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
        { input: { height: [1, 1] }, expected: 1 }
      ],
      hint: "Use two pointers starting from both ends. Move the pointer with the smaller height inward.",
      explanation: "Two pointer technique: start from both ends and move the pointer with smaller height inward, as moving the larger height pointer can only decrease the area."
    },
    {
      id: 8,
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      difficulty: "medium",
      starterCode: `def length_of_longest_substring(s):
    """
    Find the length of the longest substring without repeating characters.
    
    Args:
        s: Input string
        
    Returns:
        Length of the longest substring without repeating characters
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { s: "abcabcbb" }, expected: 3 },
        { input: { s: "bbbbb" }, expected: 1 },
        { input: { s: "pwwkew" }, expected: 3 }
      ],
      hint: "Use sliding window technique with a set to track characters in current window.",
      explanation: "Expand the window by moving right pointer, contract by moving left pointer when duplicate found."
    },
    {
      id: 9,
      title: "Product of Array Except Self",
      description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operator.",
      difficulty: "medium",
      starterCode: `def product_except_self(nums):
    """
    Return array where each element is product of all other elements.
    
    Args:
        nums: List of integers
        
    Returns:
        List of products
    """
    # Your code here
    return []`,
      testCases: [
        { input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
        { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] }
      ],
      hint: "Use two passes: first pass for left products, second pass for right products.",
      explanation: "Calculate left products in first pass, then multiply with right products in second pass."
    },
    {
      id: 10,
      title: "Group Anagrams",
      description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      difficulty: "medium",
      starterCode: `def group_anagrams(strs):
    """
    Group anagrams together.
    
    Args:
        strs: List of strings
        
    Returns:
        List of lists containing grouped anagrams
    """
    # Your code here
    return []`,
      testCases: [
        { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
        { input: { strs: [""] }, expected: [[""]] },
        { input: { strs: ["a"] }, expected: [["a"]] }
      ],
      hint: "Use sorted string as key to group anagrams together.",
      explanation: "Sort each string and use it as a key in a dictionary to group anagrams."
    }
  ],
  hard: [
    {
      id: 8,
      title: "Median of Two Sorted Arrays",
      description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
      difficulty: "hard",
      starterCode: `def find_median_sorted_arrays(nums1, nums2):
    """
    Given two sorted arrays nums1 and nums2 of size m and n respectively, 
    return the median of the two sorted arrays. 
    The overall run time complexity should be O(log (m+n)).
    
    Args:
        nums1: First sorted array
        nums2: Second sorted array
        
    Returns:
        Float representing the median
    """
    # Your code here
    return 0.0`,
      testCases: [
        { input: { nums1: [1, 3], nums2: [2] }, expected: 2.0 },
        { input: { nums1: [1, 2], nums2: [3, 4] }, expected: 2.5 }
      ],
      hint: "Use binary search on the smaller array to partition both arrays such that left halves have equal or one more element than right halves.",
      explanation: "Binary search approach: partition the smaller array and calculate corresponding partition in larger array to find the median."
    },
    {
      id: 9,
      title: "Regular Expression Matching",
      description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element.",
      difficulty: "hard",
      starterCode: `def is_match(s, p):
    """
    Given an input string s and a pattern p, implement regular expression matching 
    with support for '.' and '*' where:
    '.' Matches any single character.
    '*' Matches zero or more of the preceding element.
    
    Args:
        s: Input string
        p: Pattern string
        
    Returns:
        Boolean indicating if the string matches the pattern
    """
    # Your code here
    return False`,
      testCases: [
        { input: { s: "aa", p: "a" }, expected: false },
        { input: { s: "aa", p: "a*" }, expected: true },
        { input: { s: "ab", p: ".*" }, expected: true }
      ],
      hint: "Use dynamic programming. Create a 2D table where dp[i][j] represents if s[0...i-1] matches p[0...j-1].",
      explanation: "DP approach: handle '*' by considering both zero occurrences and one or more occurrences of the preceding character."
    },
    {
      id: 10,
      title: "Merge k Sorted Lists",
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      difficulty: "hard",
      starterCode: `def merge_k_lists(lists):
    """
    Merge k sorted linked lists into one sorted list.
    
    Args:
        lists: List of linked lists (each list is sorted)
        
    Returns:
        Merged sorted linked list
    """
    # Your code here
    return None`,
      testCases: [
        { input: { lists: [[1,4,5],[1,3,4],[2,6]] }, expected: [1,1,2,3,4,4,5,6] },
        { input: { lists: [] }, expected: [] },
        { input: { lists: [[]] }, expected: [] }
      ],
      hint: "Use divide and conquer or a min-heap to efficiently merge the lists.",
      explanation: "Divide the problem into smaller subproblems and merge pairs of lists recursively."
    },
    {
      id: 11,
      title: "First Missing Positive",
      description: "Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses constant extra space.",
      difficulty: "hard",
      starterCode: `def first_missing_positive(nums):
    """
    Find the smallest missing positive integer.
    
    Args:
        nums: List of integers
        
    Returns:
        Smallest missing positive integer
    """
    # Your code here
    return 1`,
      testCases: [
        { input: { nums: [1, 2, 0] }, expected: 3 },
        { input: { nums: [3, 4, -1, 1] }, expected: 2 },
        { input: { nums: [7, 8, 9, 11, 12] }, expected: 1 }
      ],
      hint: "Use the array itself as a hash table. Place each number at its correct index.",
      explanation: "For each number, place it at index (number-1) if it's in range [1, n]."
    },
    {
      id: 12,
      title: "Trapping Rain Water",
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      difficulty: "hard",
      starterCode: `def trap(height):
    """
    Calculate trapped rainwater.
    
    Args:
        height: List of non-negative integers representing elevation
        
    Returns:
        Amount of trapped water
    """
    # Your code here
    return 0`,
      testCases: [
        { input: { height: [0,1,0,2,1,0,1,3,2,1,2,1] }, expected: 6 },
        { input: { height: [4,2,0,3,2,5] }, expected: 9 },
        { input: { height: [3,0,2,0,4] }, expected: 7 }
      ],
      hint: "Use two pointers or calculate left and right maximum heights for each position.",
      explanation: "Water trapped at position i is min(leftMax[i], rightMax[i]) - height[i]."
    }
  ]
};

// Function to get a random question by difficulty
export const getRandomQuestion = (difficulty = 'easy') => {
  const questions = leetcodeQuestions[difficulty];
  if (!questions || questions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Function to get all questions by difficulty
export const getQuestionsByDifficulty = (difficulty) => {
  return leetcodeQuestions[difficulty] || [];
};

// Function to get a specific question by ID
export const getQuestionById = (id) => {
  for (const difficulty in leetcodeQuestions) {
    const question = leetcodeQuestions[difficulty].find(q => q.id === id);
    if (question) {
      return question;
    }
  }
  return null;
};

// Function to get total count of questions
export const getTotalQuestionCount = () => {
  return Object.values(leetcodeQuestions).reduce((total, questions) => total + questions.length, 0);
};

export default leetcodeQuestions;
