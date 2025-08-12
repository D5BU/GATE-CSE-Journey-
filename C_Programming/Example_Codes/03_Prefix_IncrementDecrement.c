#include<stdio.h>
int main(void)
{
    int x = 8;
    printf(" x = %d\n",x); // Initial value of x
    printf(" x=  %d\t",++x); // Increment x and print
    printf(" x = %d\t",x); // Print current value of x
    printf(" x = %d\t",--x); // Decrement x and print
    printf(" x =%d\n", x); // Print final value of x
    return 0;
}